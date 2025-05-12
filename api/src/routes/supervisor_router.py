# src/routes/supervisor_router.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from ..db import get_session
from ..models.supervisor import Supervisor
from ..models.user import User
from ..schemas import (
    SupervisorCreate,
    SupervisorRead,
    SupervisorUpdate,
)

supervisor_router = APIRouter(prefix="/supervisors", tags=["supervisors"])

@supervisor_router.get("/", response_model=list[SupervisorRead])
async def list_supervisors(session: AsyncSession = Depends(get_session)):
    result = await session.execute(
        select(Supervisor).options(selectinload(Supervisor.user))
    )
    return result.scalars().all() # .all() is correct for scalars()

@supervisor_router.get("/{supervisor_id}", response_model=SupervisorRead)
async def get_supervisor(
    supervisor_id: str, # Assuming supervisor_id is also a UUID string
    session: AsyncSession = Depends(get_session)
):
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
async def create_supervisor(
    data: SupervisorCreate,
    session: AsyncSession = Depends(get_session)
):
    user = await session.get(User, data.user_id)
    if not user:
        raise HTTPException(status_code=400, detail="User not found")

    supervisor = Supervisor(
        user_id=data.user_id,
        specialization=data.specialization
    )
    session.add(supervisor)
    await session.commit()
    # Refresh to get DB defaults (like ID) and then load the 'user' relationship
    await session.refresh(supervisor) 
    await session.refresh(supervisor, attribute_names=["user"]) # This loads supervisor.user
    return supervisor

@supervisor_router.put("/{supervisor_id}", response_model=SupervisorRead)
async def update_supervisor(
    supervisor_id: str, # Assuming supervisor_id is also a UUID string
    data: SupervisorUpdate,
    session: AsyncSession = Depends(get_session)
):
    result = await session.execute(
        select(Supervisor).where(Supervisor.id == supervisor_id)
        # No need for selectinload here, just fetching for update
    )
    supervisor = result.scalar_one_or_none()
    if not supervisor:
        raise HTTPException(status_code=404, detail="Supervisor not found") # Corrected typo 'status_codehaystack'

    update_data = data.model_dump(exclude_unset=True) # Pydantic V2

    if "user_id" in update_data and update_data["user_id"] is not None:
        user = await session.get(User, update_data["user_id"])
        if not user:
            raise HTTPException(status_code=400, detail="User not found for update.")
        supervisor.user_id = update_data["user_id"] # Assign validated ID

    if "specialization" in update_data and update_data["specialization"] is not None:
        supervisor.specialization = update_data["specialization"]

    await session.commit()
    # Refresh scalar attributes and then the 'user' relationship
    await session.refresh(supervisor)
    await session.refresh(supervisor, attribute_names=["user"]) 
    return supervisor

@supervisor_router.delete("/{supervisor_id}", status_code=204)
async def delete_supervisor(
    supervisor_id: str, # Assuming supervisor_id is also a UUID string
    session: AsyncSession = Depends(get_session)
):
    result = await session.execute(
        select(Supervisor).where(Supervisor.id == supervisor_id)
    )
    supervisor = result.scalar_one_or_none()
    if not supervisor:
        raise HTTPException(status_code=404, detail="Supervisor not found")
    await session.delete(supervisor)
    await session.commit()
    return None # Or Response(status_code=204)