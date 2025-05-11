

# src/routes/routers.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from ..db import get_session
from ..models.thesis import Thesis
from ..models.supervisor import Supervisor
from ..schemas import (
    ThesisCreate, ThesisRead, ThesisUpdate,
    SupervisorCreate, SupervisorRead, SupervisorUpdate
)

# Router dla prac dyplomowych
thesis_router = APIRouter(prefix="/theses", tags=["theses"])

@thesis_router.get("/", response_model=list[ThesisRead])
async def list_theses(session: AsyncSession = Depends(get_session)):
    result = await session.execute(
        select(Thesis)
        .options(
            selectinload(Thesis.supervisor).selectinload(Supervisor.user),
            selectinload(Thesis.student)
        )
    )
    theses = result.scalars().all()
    return theses

@thesis_router.get("/{thesis_id}", response_model=ThesisRead)
async def get_thesis(thesis_id: int, session: AsyncSession = Depends(get_session)):
    result = await session.execute(
        select(Thesis)
        .where(Thesis.id == thesis_id)
        .options(
            selectinload(Thesis.supervisor).selectinload(Supervisor.user),
            selectinload(Thesis.student)
        )
    )
    thesis = result.scalar_one_or_none()
    if not thesis:
        raise HTTPException(status_code=404, detail="Thesis not found")
    return thesis

@thesis_router.post("/", response_model=ThesisRead, status_code=201)
async def create_thesis(data: ThesisCreate, session: AsyncSession = Depends(get_session)):
    # Validate supervisor exists
    sup = await session.get(Supervisor, data.supervisor_id)
    if not sup:
        raise HTTPException(status_code=400, detail="Supervisor not found")
    # Validate student exists
    from ..models.user import User
    stu = await session.get(User, data.student_id)
    if not stu:
        raise HTTPException(status_code=400, detail="Student not found")
    thesis = Thesis(
        title=data.title,
        description=data.description,
        status=data.status,
        supervisor_id=data.supervisor_id,
        student_id=data.student_id
    )
    session.add(thesis)
    await session.commit()
    await session.refresh(thesis)
    # eager load relationships
    await session.refresh(thesis, attribute_names=["supervisor", "student"])
    return thesis("/", response_model=ThesisRead, status_code=201)
async def create_thesis(data: ThesisCreate, session: AsyncSession = Depends(get_session)):
    thesis = Thesis(
        title=data.title,
        description=data.description,
        status=data.status,
        supervisor_id=data.supervisor_id,
        student_id=data.student_id
    )
    session.add(thesis)
    await session.commit()
    await session.refresh(thesis)
    # eager load relationships
    await session.refresh(thesis, attribute_names=["supervisor", "student"])
    return thesis

@thesis_router.put("/{thesis_id}", response_model=ThesisRead)
async def update_thesis(thesis_id: int, data: ThesisUpdate, session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Thesis).where(Thesis.id == thesis_id))
    thesis = result.scalar_one_or_none()
    if not thesis:
        raise HTTPException(status_code=404, detail="Thesis not found")
    for field, value in data.dict(exclude_unset=True).items():
        setattr(thesis, field, value)
    await session.commit()
    await session.refresh(thesis)
    await session.refresh(thesis, attribute_names=["supervisor", "student"])
    return thesis

@thesis_router.delete("/{thesis_id}", status_code=204)
async def delete_thesis(thesis_id: int, session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Thesis).where(Thesis.id == thesis_id))
    thesis = result.scalar_one_or_none()
    if not thesis:
        raise HTTPException(status_code=404, detail="Thesis not found")
    await session.delete(thesis)
    await session.commit()
    return None