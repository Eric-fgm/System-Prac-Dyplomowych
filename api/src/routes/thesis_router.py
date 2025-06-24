from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_, delete
from sqlalchemy.orm import selectinload
from typing import Optional

from ..routes.auth_router import fastapi_users
from ..db import get_session
from ..models.user import User
from ..models.thesis import Thesis, ThesisStatus
from ..models.thesis_application import ThesisApplication
from ..models.supervisor import Supervisor
from ..schemas import (
    ThesisAssign, ThesisCreate, ThesisRead, ThesisReadWithApplicant, ThesisUpdate, Pagination
)

# Router dla prac dyplomowych
thesis_router = APIRouter(prefix="/theses", tags=["theses"])

@thesis_router.get("/categories", response_model=list[str])
async def get_categories(session: AsyncSession = Depends(get_session)):
    stmt = select(Thesis.category).distinct()
    result = await session.execute(stmt)

    return result.scalars().all()


@thesis_router.get("/", response_model=Pagination[ThesisRead])
async def list_theses(
    search: Optional[str] = Query(None),
    department: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    kind: Optional[str] = Query(None),
    supervisor_id: Optional[str] = Query(None),
    user_id: Optional[int] = Query(None),
    page: int = Query(1, ge=1),
    per_page: int = Query(4, ge=1),
    session: AsyncSession = Depends(get_session)
):
    stmt = select(Thesis).options(selectinload(Thesis.supervisor).selectinload(Supervisor.user))
    if search:
        stmt = stmt.where(or_(Thesis.title.ilike(f"%{search}%"), Thesis.description.ilike(f"%{search}%")))
    if department:
        stmt = stmt.where(Thesis.department == department)
    if category:
        stmt = stmt.where(Thesis.category == category)
    if status:
        stmt = stmt.where(Thesis.status == status)
    if supervisor_id:
        stmt = stmt.where(Thesis.supervisor_id == supervisor_id)
    if kind:
        stmt = stmt.where(Thesis.kind == kind)
    if user_id:
        stmt = stmt.join(ThesisApplication, ThesisApplication.thesis_id == Thesis.id).where(ThesisApplication.user_id == user_id)

    count_stmt = select(func.count()).select_from(stmt.subquery())
    total_result = await session.execute(count_stmt)
    total = total_result.scalar()

    stmt = stmt.limit(per_page).offset((page - 1) * per_page)
    result = await session.execute(stmt)
    theses = result.scalars().all()

    return Pagination(
        results=theses,
        total=total,
        page=page,
        per_page=per_page,
        total_pages=(total + per_page - 1) // per_page
    )


@thesis_router.get("/{thesis_id}", response_model=ThesisReadWithApplicant)
async def get_thesis(thesis_id: str, session: AsyncSession = Depends(get_session)):
    result = await session.execute(
        select(Thesis)
        .where(Thesis.id == thesis_id)
        .options(
            selectinload(Thesis.supervisor).selectinload(Supervisor.user),
            selectinload(Thesis.applicants).selectinload(ThesisApplication.user)
        )
    )
    thesis = result.scalar_one_or_none()
    if not thesis:
        raise HTTPException(status_code=404, detail="Thesis not found")
    
    return ThesisReadWithApplicant(**thesis.__dict__, motivation=thesis.applicants[0].motivation if len(thesis.applicants) else None, applicant=thesis.applicants[0].user if len(thesis.applicants) else None)

@thesis_router.post("/{thesis_id}/assign", status_code=204)
async def assign_to_thesis(thesis_id: str, data: ThesisAssign, user: User = Depends(fastapi_users.current_user()), session: AsyncSession = Depends(get_session)):
    result = await session.execute(
        select(Thesis)
        .where(Thesis.id == thesis_id)
        .options(
            selectinload(Thesis.supervisor),
            selectinload(Thesis.applicants)
        )
    )
    thesis = result.scalar_one_or_none()

    if not thesis:
        raise HTTPException(status_code=404, detail="Thesis not found")
    
    if thesis.supervisor.user_id == user.id:
        raise HTTPException(status_code=400, detail="You cannot assign to own thesis")
    
    if thesis.status != ThesisStatus.available:
        raise HTTPException(status_code=400, detail="This thesis is not available")

    thesis_application = ThesisApplication(
        motivation=data.motivation,
        user_id=user.id,
        thesis_id=thesis.id
    )
    session.add(thesis_application)
    thesis.status = ThesisStatus.waiting

    await session.commit()
        

@thesis_router.post("/{thesis_id}/status/{action}", status_code=204)
async def change_thesis_status(action: str, thesis_id: str, user: User = Depends(fastapi_users.current_user()), session: AsyncSession = Depends(get_session)):
    result = await session.execute(
        select(Thesis)
        .where(Thesis.id == thesis_id)
        .where(Supervisor.user_id == user.id)
        .options(
            selectinload(Thesis.supervisor),
            selectinload(Thesis.applicants)
        )
    )
    thesis = result.scalar_one_or_none()

    if not thesis:
        raise HTTPException(status_code=404, detail="Thesis not found")
    
    if thesis.status != ThesisStatus.waiting:
        raise HTTPException(status_code=400, detail="Wrong current status")
    
    if action == "reject":
        await session.execute(
            delete(ThesisApplication).where(ThesisApplication.thesis == thesis)
        )
        thesis.status = ThesisStatus.available
    elif action == "accept" and len(thesis.applicants):
        thesis.accepted_at = datetime.now()
        thesis.status = ThesisStatus.in_progress
    else:
        raise HTTPException(status_code=400, detail="Wrong action")

    await session.commit()

@thesis_router.post("/", response_model=ThesisRead, status_code=201)
async def create_thesis(data: ThesisCreate, session: AsyncSession = Depends(get_session)):
    if not await session.get(Supervisor, data.supervisor_id):
        raise HTTPException(status_code=400, detail="Supervisor not found")

    thesis = Thesis(
        title=data.title,
        description=data.description,
        status=data.status,
        category=data.category,
        deadline=data.deadline,
        kind=data.kind,
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