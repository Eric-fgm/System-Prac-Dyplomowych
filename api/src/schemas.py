import uuid
from .models.thesis import ThesisStatus
from typing import Optional

from pydantic import BaseModel, EmailStr
from fastapi_users import schemas


# -------------------------
#   USER SCHEMAS
# -------------------------
class UserRead(schemas.BaseUser[uuid.UUID]):
    email: EmailStr
    first_name: str
    last_name: str

    class Config:
        orm_mode = True


class UserCreate(schemas.BaseUserCreate):
    first_name: str
    last_name: str


class UserUpdate(schemas.BaseUserUpdate):
    first_name: Optional[str] = None
    last_name: Optional[str] = None


# -------------------------
#   SUPERVISOR SCHEMAS
# -------------------------

class SupervisorCreate(BaseModel):
    user_id: int
    specialization: str


class SupervisorUpdate(BaseModel):
    user_id: Optional[int] = None
    specialization: Optional[str] = None


class SupervisorRead(BaseModel):
    id: int
    specialization: str
    user: UserRead

    class Config:
        orm_mode = True


# -------------------------
#   THESIS SCHEMAS
# -------------------------

class ThesisCreate(BaseModel):
    title: str
    description: str
    status: Optional[ThesisStatus] = ThesisStatus.proposed
    supervisor_id: int
    student_id: int


class ThesisUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[ThesisStatus] = None
    supervisor_id: Optional[int] = None
    student_id: Optional[int] = None


class ThesisRead(BaseModel):
    id: int
    title: str
    description: str
    status: ThesisStatus
    supervisor: SupervisorRead
    student: UserRead

    class Config:
        orm_mode = True


