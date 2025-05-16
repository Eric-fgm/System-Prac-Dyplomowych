# src/schemas.py
from datetime import datetime
from typing import Optional, Generic, TypeVar, List
from pydantic import BaseModel, EmailStr
from pydantic.generics import GenericModel
from fastapi_users import schemas
from .models.thesis import ThesisKind, ThesisStatus # Ensure this path is correct if schemas.py is in a different dir than models/

# -------------------------
#   USER SCHEMAS
# -------------------------
class UserRead(schemas.BaseUser[int]):
    email: EmailStr
    first_name: Optional[str] = None # Make fields optional if they can be missing in DB
    last_name: Optional[str] = None  # Make fields optional if they can be missing in DB

    class Config:
        from_attributes = True

class UserCreate(schemas.BaseUserCreate):
    first_name: str
    last_name: str

class UserUpdate(schemas.BaseUserUpdate):
    first_name: Optional[str] = None
    last_name: Optional[str] = None

# -------------------------
#   SUPERVISOR SCHEMAS
# -------------------------
class SupervisorBase(BaseModel): # Renamed for clarity, not strictly necessary
    specialization: str

class SupervisorCreate(SupervisorBase):
    user_id: int

class SupervisorRawRead(SupervisorBase):
    id: str
    user_id: int

class SupervisorRead(SupervisorBase): # For response
    id: str
    user: UserRead

    class Config:
        from_attributes = True

class SupervisorUpdate(BaseModel): # Was SupervisorBase before, but update can be partial
    user_id: Optional[str] = None
    specialization: Optional[str] = None

class UserPriviligedRead(UserRead):
    supervisor: Optional[SupervisorRawRead] = None

# -------------------------
#   THESIS SCHEMAS
# -------------------------
class ThesisBase(BaseModel): # Renamed for clarity
    title: str
    description: str
    department: str
    category: str
    kind: ThesisKind
    year: int
    deadline: Optional[datetime] = None
    accepted_at: Optional[datetime] = None

class ThesisCreate(ThesisBase):
    status: Optional[ThesisStatus] = ThesisStatus.available
    supervisor_id: str

class ThesisUpdate(BaseModel): # Was ThesisBase, but update can be partial
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[ThesisStatus] = None
    department: Optional[str] = None
    year: Optional[int] = None
    supervisor_id: Optional[str] = None

class ThesisRead(ThesisBase): # For response
    id: str
    status: ThesisStatus
    # supervisor_id: str # Optional: You might want to include the raw FKs
    # student_id: str    # Optional: You might want to include the raw FKs
    supervisor: SupervisorRead # Make nested Supervisor optional

    class Config:
        from_attributes = True

class ThesisReadWithApplicant(ThesisRead):
    applicant: Optional[UserRead]
    motivation: Optional[str]

class ThesisAssign(BaseModel):
    motivation: str

# -------------------------
#   HELPER SCHEMAS
# -------------------------
T = TypeVar("T")
class Pagination(GenericModel, Generic[T]):
    results: List[T]
    total: int
    page: int
    per_page: int
    total_pages: int