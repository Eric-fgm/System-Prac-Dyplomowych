# src/schemas.py
import uuid
from typing import Optional
from pydantic import BaseModel, EmailStr
from fastapi_users import schemas
from .models.thesis import ThesisStatus # Ensure this path is correct if schemas.py is in a different dir than models/

# -------------------------
#   USER SCHEMAS
# -------------------------
class UserRead(schemas.BaseUser[uuid.UUID]):
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
    user_id: str

class SupervisorRawRead(SupervisorBase):
    id: str
    user_id: str

class SupervisorRead(SupervisorBase): # For response
    id: str
    user_id: str # Keep this to show the FK value
    user: Optional[UserRead] = None # Make the nested User object optional

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
    year: int

class ThesisCreate(ThesisBase):
    status: Optional[ThesisStatus] = ThesisStatus.proposed
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
    supervisor: Optional[SupervisorRead] = None # Make nested Supervisor optional

    class Config:
        from_attributes = True