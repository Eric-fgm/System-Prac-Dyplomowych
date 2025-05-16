from fastapi import Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional
from ..models.supervisor import Supervisor
from ..models.user import User
from ..schemas import UserRead, UserUpdate, UserPriviligedRead, SupervisorRawRead, Pagination
from .auth_router import fastapi_users
from ..db import get_session

users_router = fastapi_users.get_users_router(UserRead, UserUpdate)

@users_router.get("/", response_model=Pagination[UserPriviligedRead])
async def get_users(
    search: Optional[str] = Query(None),
    department: Optional[str] = Query(None),
    role: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1),
    session: AsyncSession = Depends(get_session)
):
    stmt = select(User, Supervisor).outerjoin(Supervisor, User.id == Supervisor.user_id)
    if search:
        stmt = stmt.where(func.concat(User.first_name, " ", User.last_name).ilike(f"%{search}%"))
    if department:
        stmt = stmt.where(Supervisor.specialization == department)
    if role == 'students':
        stmt = stmt.where(Supervisor.id.is_(None))
    if role == 'supervisors':
        stmt = stmt.where(Supervisor.id.isnot(None))

    count_stmt = select(func.count()).select_from(stmt.subquery())
    total_result = await session.execute(count_stmt)
    total = total_result.scalar()

    stmt = stmt.limit(per_page).offset((page - 1) * per_page)
    result = await session.execute(stmt)
    users_with_supervisors = result.all()

    results = [UserPriviligedRead(
                id=user.id,
                email=user.email,
                is_active=user.is_active,
                is_superuser=user.is_superuser, 
                is_verified=user.is_verified,
                first_name=user.first_name,
                last_name=user.last_name,
                supervisor=SupervisorRawRead(id=supervisor.id, user_id=supervisor.user_id, specialization=supervisor.specialization) if supervisor is not None else None
            ) for user, supervisor in users_with_supervisors]

    return Pagination(
        results=results,
        total=total,
        page=page,
        per_page=per_page,
        total_pages=(total + per_page - 1) // per_page
    )