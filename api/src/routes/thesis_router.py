# src/routes/thesis_router.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
import uuid  # Import uuid for type hinting if desired

from ..db import get_session
from ..models.thesis import Thesis
from ..models.supervisor import Supervisor
from ..models.user import User  # Add User import at the top
from ..schemas import (
    ThesisCreate, ThesisRead, ThesisUpdate,
    # SupervisorCreate, SupervisorRead, SupervisorUpdate # Not directly used here, but good for context
)

# Router dla prac dyplomowych
thesis_router = APIRouter(prefix="/theses", tags=["theses"])


@thesis_router.get("/", response_model=list[ThesisRead])
async def list_theses(session: AsyncSession = Depends(get_session)):
    result = await session.execute(
        select(Thesis)
        .options(
            selectinload(Thesis.supervisor).selectinload(Supervisor.user)
        )
    )
    theses = result.scalars().all()
    return theses


@thesis_router.get("/{thesis_id}", response_model=ThesisRead)
async def get_thesis(thesis_id: str, session: AsyncSession = Depends(get_session)):  # Changed to str
    result = await session.execute(
        select(Thesis)
        .where(Thesis.id == thesis_id)
        .options(
            selectinload(Thesis.supervisor).selectinload(Supervisor.user)
        )
    )
    thesis = result.scalar_one_or_none()
    if not thesis:
        raise HTTPException(status_code=404, detail="Thesis not found")
    return thesis


@thesis_router.post("/", response_model=ThesisRead, status_code=201)
async def create_thesis(data: ThesisCreate, session: AsyncSession = Depends(get_session)):
    # Validate supervisor exists
    if not await session.get(Supervisor, data.supervisor_id):
        raise HTTPException(status_code=400, detail="Supervisor not found")

    thesis = Thesis(
        title=data.title,
        description=data.description,
        status=data.status,
        department=data.department,
        year=data.year,
        supervisor_id=data.supervisor_id,
    )
    session.add(thesis)
    await session.commit()
    # To ensure the response model ThesisRead can be populated correctly,
    # including nested SupervisorRead.user and UserRead for student,
    # re-fetch the created thesis with all required relationships.
    await session.refresh(thesis)  # Get the ID and any other DB-generated values

    result = await session.execute(
        select(Thesis)
        .where(Thesis.id == thesis.id)  # Use the ID of the just-created thesis
        .options(
            selectinload(Thesis.supervisor).selectinload(Supervisor.user),
        )
    )
    created_thesis_with_relations = result.scalar_one_or_none()

    if not created_thesis_with_relations:
        # This would be an unexpected internal error if commit was successful
        raise HTTPException(status_code=500, detail="Failed to retrieve created thesis after commit.")

    return created_thesis_with_relations


@thesis_router.put("/{thesis_id}", response_model=ThesisRead)
async def update_thesis(thesis_id: str, data: ThesisUpdate,
                        session: AsyncSession = Depends(get_session)):  # Changed to str
    result_fetch = await session.execute(
        select(Thesis)
        .where(Thesis.id == thesis_id)
        # No need for options here yet, just fetching to update
    )
    thesis = result_fetch.scalar_one_or_none()

    if not thesis:
        raise HTTPException(status_code=404, detail="Thesis not found")

    # Pydantic V2 uses model_dump
    update_data = data.model_dump(exclude_unset=True)

    # Validate FKs if they are being changed
    if "supervisor_id" in update_data and update_data["supervisor_id"] is not None:
        if not await session.get(Supervisor, update_data["supervisor_id"]):
            raise HTTPException(status_code=400, detail="Supervisor not found for update.")

    for field, value in update_data.items():
        setattr(thesis, field, value)

    await session.commit()
    # Re-fetch to ensure all relationships for ThesisRead are loaded correctly for the response
    # This also ensures we get any DB-side updates if there were triggers/defaults

    # It's cleaner to use the same thesis_id from the path param for the re-fetch.
    result_updated = await session.execute(
        select(Thesis)
        .where(Thesis.id == thesis_id)
        .options(
            selectinload(Thesis.supervisor).selectinload(Supervisor.user),
        )
    )
    updated_thesis_with_relations = result_updated.scalar_one_or_none()

    if not updated_thesis_with_relations:
        # Should not happen if the initial fetch found the thesis
        raise HTTPException(status_code=404, detail="Thesis not found after update operation.")
    return updated_thesis_with_relations


@thesis_router.delete("/{thesis_id}", status_code=204)
async def delete_thesis(thesis_id: str, session: AsyncSession = Depends(get_session)):  # Changed to str
    result = await session.execute(select(Thesis).where(Thesis.id == thesis_id))
    thesis = result.scalar_one_or_none()
    if not thesis:
        raise HTTPException(status_code=404, detail="Thesis not found")
    await session.delete(thesis)
    await session.commit()
    return None  # For 204 No Content, return None or Response(status_code=204)