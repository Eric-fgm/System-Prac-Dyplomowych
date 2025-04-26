from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from db import create_db_and_tables
from users import auth_backend, current_active_user, fastapi_users
from schemas import UserCreate, UserRead, UserUpdate


@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_db_and_tables()
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(fastapi_users.get_auth_router(auth_backend), prefix="/auth")
app.include_router(fastapi_users.get_register_router(UserRead, UserCreate), prefix="/auth")
app.include_router(fastapi_users.get_reset_password_router(), prefix="/auth")
app.include_router(fastapi_users.get_users_router(UserRead, UserUpdate), prefix="/users")

@app.get("/authenticated-route")
async def authenticated_route(user = Depends(current_active_user)):
    return {"message": f"Hello {user.email}!"}