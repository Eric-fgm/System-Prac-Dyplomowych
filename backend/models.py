from sqlalchemy import Column, Integer, String, Enum, ForeignKey
from sqlalchemy.orm import relationship
from .roles import UserRole
from .database import Base
from .schemas import ThesisStatus
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.student)
    hashed_password = Column(String, nullable=False)
    thesis = relationship("Thesis", back_populates="student", foreign_keys="Thesis.student_id")
    supervises = relationship("Thesis", back_populates="supervisor", foreign_keys="Thesis.supervisor_id")


class Thesis(Base):
    __tablename__ = "theses"

    id             = Column(Integer, primary_key=True, index=True)
    title          = Column(String, nullable=False)
    abstract       = Column(String, nullable=True)
    date_submitted = Column(String, nullable=True)
    status         = Column(Enum(ThesisStatus), default=ThesisStatus.draft)

    student_id     = Column(Integer, ForeignKey("users.id"), nullable=False)
    supervisor_id  = Column(Integer, ForeignKey("users.id"), nullable=False)

    student = relationship("User", back_populates="thesis", foreign_keys="[Thesis.student_id]")
    supervisor = relationship("User", back_populates="supervises", foreign_keys="[Thesis.supervisor_id]")
