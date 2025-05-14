from ..models.supervisor import Supervisor
from ..schemas import UserCreate, UserPriviligedRead, UserRead, SupervisorRawRead
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi_users import FastAPIUsers
from fastapi_users.authentication import (
    AuthenticationBackend,
    CookieTransport,
    JWTStrategy,
)
from fastapi import Depends
from fastapi_users.db import SQLAlchemyUserDatabase
from fastapi import Depends
from fastapi_users import BaseUserManager, IntegerIDMixin
from fastapi_users.db import SQLAlchemyUserDatabase
from sqlalchemy.future import select
from ..db import get_session
from ..models.user import User

SECRET = "SECRET"

class UserManager(IntegerIDMixin, BaseUserManager[User, int]):
    reset_password_token_secret = SECRET
    verification_token_secret = SECRET

async def get_user_db(session = Depends(get_session)):
    yield SQLAlchemyUserDatabase(session, User)

async def get_user_manager(user_db: SQLAlchemyUserDatabase = Depends(get_user_db)):
    yield UserManager(user_db)

def get_jwt_strategy():
    return JWTStrategy(secret=SECRET, lifetime_seconds=7 * 24 * 3600)

auth_adapter = AuthenticationBackend(
    name="jwt",
    transport=CookieTransport(cookie_max_age=7 * 24 * 3600, cookie_secure=False, cookie_samesite="lax"),
    get_strategy=get_jwt_strategy,
)

fastapi_users = FastAPIUsers[User, int](get_user_manager, [auth_adapter])

auth_router = fastapi_users.get_auth_router(auth_adapter)
auth_router.include_router(fastapi_users.get_register_router(UserRead, UserCreate))

@auth_router.get("/me", response_model=UserPriviligedRead)
async def get_me(user: User = Depends(fastapi_users.current_user()), session: AsyncSession = Depends(get_session)):
    result = await session.execute(
        select(Supervisor)
        .where(Supervisor.user_id == user.id)
    )
    supervisor = result.scalar_one_or_none()
    return UserPriviligedRead(
            id=user.id,
            email=user.email,
            is_active=user.is_active,
            is_superuser=user.is_superuser, 
            is_verified=user.is_verified,
            first_name=user.first_name,
            last_name=user.last_name,
            supervisor=SupervisorRawRead(id=supervisor.id, user_id=supervisor.user_id, specialization=supervisor.specialization) if supervisor is not None else None
        )