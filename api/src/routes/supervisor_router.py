from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload, aliased
from typing import Optional

from ..routes.auth_router import fastapi_users
from ..db import get_session
from ..models.supervisor import Supervisor
from ..models.user import User
from ..schemas import (
    SupervisorCreate,
    SupervisorRead,
    SupervisorUpdate,
    Pagination,
)

supervisor_router = APIRouter(prefix="/supervisors", tags=["supervisors"])

@supervisor_router.get("/specializations", response_model=list[str])
async def get_supervisors_specializations(session: AsyncSession = Depends(get_session)):
    stmt = select(Supervisor.specialization).distinct()
    result = await session.execute(stmt)

    return result.scalars().all()

@supervisor_router.get("/", response_model=Pagination[SupervisorRead])
async def list_supervisors(
    search: Optional[str] = Query(None),
    specialization: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1),
    session: AsyncSession = Depends(get_session)
):
    stmt = select(User, Supervisor).outerjoin(Supervisor, User.id == Supervisor.user_id).where(Supervisor.id.isnot(None))
    if search:
        stmt = stmt.where(func.concat(User.first_name, " ", User.last_name).ilike(f"%{search}%"))
    if specialization:
        stmt = stmt.where(Supervisor.specialization == specialization)
    
    count_stmt = select(func.count()).select_from(stmt.subquery())
    total_result = await session.execute(count_stmt)
    total = total_result.scalar()
    
    stmt = stmt.limit(per_page).offset((page - 1) * per_page)
    result = await session.execute(stmt)
    supervisors = [SupervisorRead(id=supervisor.id, specialization=supervisor.specialization, user=user) for user, supervisor in result.all()]

    return Pagination(
        results=supervisors,
        total=total,
        page=page,
        per_page=per_page,
        total_pages=(total + per_page - 1) // per_page
    )

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