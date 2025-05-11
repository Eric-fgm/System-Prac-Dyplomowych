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


# Router dla promotorów (supervisors)
supervisor_router = APIRouter(prefix="/supervisors", tags=["supervisors"])

@supervisor_router.get("/", response_model=list[SupervisorRead])
async def list_supervisors(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Supervisor).options(selectinload(Supervisor.user)))
    supervisors = result.scalars().all()
    return supervisors

@supervisor_router.get("/{supervisor_id}", response_model=SupervisorRead)
async def get_supervisor(supervisor_id: int, session: AsyncSession = Depends(get_session)):
    result = await session.execute(
        select(Supervisor)
        .where(Supervisor.id == supervisor_id)
        .options(selectinload(Supervisor.user))
    )
    supervisor = result.scalar_one_or_none()
    if not supervisor:
        raise HTTPException(status_code=404, detail="Supervisor not found")
    return supervisor

@supervisor_router.post("/", response_model=SupervisorRead, status_code=201)
async def create_supervisor(data: SupervisorCreate, session: AsyncSession = Depends(get_session)):
    supervisor = Supervisor(
        user_id=data.user_id,
        specialization=data.specialization
    )
    session.add(supervisor)
    await session.commit()
    await session.refresh(supervisor)
    await session.refresh(supervisor, attribute_names=["user"])
    return supervisor

@supervisor_router.put("/{supervisor_id}", response_model=SupervisorRead)
async def update_supervisor(supervisor_id: int, data: SupervisorUpdate, session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Supervisor).where(Supervisor.id == supervisor_id))
    supervisor = result.scalar_one_or_none()
    if not supervisor:
        raise HTTPException(status_code=404, detail="Supervisor not found")
    for field, value in data.dict(exclude_unset=True).items():
        setattr(supervisor, field, value)
    await session.commit()
    await session.refresh(supervisor)
    await session.refresh(supervisor, attribute_names=["user"])
    return supervisor

@supervisor_router.delete("/{supervisor_id}", status_code=204)
async def delete_supervisor(supervisor_id: int, session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Supervisor).where(Supervisor.id == supervisor_id))
    supervisor = result.scalar_one_or_none()
    if not supervisor:
        raise HTTPException(status_code=404, detail="Supervisor not found")
    await session.delete(supervisor)
    await session.commit()
    return None
