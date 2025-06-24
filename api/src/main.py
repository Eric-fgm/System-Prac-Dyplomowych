import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware

from .db import create_db_and_tables
from .routes.auth_router import auth_router
from .routes.users_router import users_router
from .routes.thesis_router import thesis_router
from .routes.supervisor_router import supervisor_router
from .utils.seed import seed

@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_db_and_tables()
    await seed()

    yield


app = FastAPI(lifespan=lifespan)

class DelayMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        await asyncio.sleep(0.2)
        response = await call_next(request)
        return response

app.add_middleware(DelayMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(users_router, prefix="/users", tags=["users"])
app.include_router(thesis_router)
app.include_router(supervisor_router)