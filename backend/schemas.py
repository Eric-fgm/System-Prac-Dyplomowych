from pydantic import BaseModel, EmailStr
from typing import Optional
from .roles import UserRole
from enum import Enum

class UserBase(BaseModel):
    name: str
    email: str
    role: UserRole

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    role: UserRole
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: UserRole

    class Config:
        orm_mode = True

class User(UserBase):
    id: int

    class Config:
        orm_mode = True


class ThesisStatus(str, Enum):
    draft = "draft"
    submitted = "submitted"
    defended = "defended"


class ThesisBase(BaseModel):
    title: str
    abstract: Optional[str] = None
    status: ThesisStatus = ThesisStatus.draft
    student_id: int
    supervisor_id: int


class ThesisCreate(BaseModel):
    title: str
    abstract: Optional[str] = None
    student_id: int
    supervisor_id: int
    status: Optional[str] = "draft"

    class Config:
        orm_mode = True


class Thesis(ThesisBase):
    id: int

    class Config:
        orm_mode = True
