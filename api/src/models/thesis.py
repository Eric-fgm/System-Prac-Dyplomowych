# src/models/thesis.py

import uuid
import enum
from sqlalchemy import Integer, Column, String, ForeignKey
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
    department = Column(String, nullable=False)
    year = Column(Integer, nullable=False)

    supervisor_id = Column(String, ForeignKey("supervisors.id"), nullable=False)

    supervisor = relationship("Supervisor", back_populates="theses")
