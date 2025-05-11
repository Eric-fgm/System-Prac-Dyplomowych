# src/models/thesis.py

import uuid
import enum
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.types import Enum as SAEnum
from sqlalchemy.orm import relationship
from ..db import Base


class ThesisStatus(str, enum.Enum):
    proposed = "proposed"
    accepted = "accepted"
    in_progress = "in_progress"
    submitted = "submitted"
    defended = "defended"
    rejected = "rejected"

class Thesis(Base):
    __tablename__ = "thesis"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    status = Column(
        SAEnum(ThesisStatus, name="thesis_status", native_enum=False),
        default=ThesisStatus.proposed,
        nullable=False
    )
    supervisor_id = Column(String, ForeignKey("supervisors.id"), nullable=False)
    student_id = Column(String, ForeignKey("users.id"), nullable=False)

    supervisor = relationship("Supervisor", back_populates="theses")
    student = relationship("User", foreign_keys=[student_id], backref="theses")
