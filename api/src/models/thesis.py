import uuid
import enum
from sqlalchemy import Integer, Column, String, ForeignKey, DateTime
from sqlalchemy.types import Enum as SAEnum
from sqlalchemy.orm import relationship
from ..db import Base


class ThesisStatus(str, enum.Enum):
    available = "available"
    in_progress = "in_progress"
    defended = "defended"
    waiting = "waiting"
    proposed = "proposed"

class ThesisKind(str, enum.Enum):
    engineering = "engineering"
    master = "master"
    bachelor = "bachelor"

class Thesis(Base):
    __tablename__ = "thesis"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    status = Column(
        SAEnum(ThesisStatus, name="thesis_status", native_enum=False),
        default=ThesisStatus.available,
        nullable=False
    )
    kind = Column(
        SAEnum(ThesisKind, name="thesis_kind", native_enum=False),
        nullable=False
    )
    category = Column(String, nullable=False)
    department = Column(String, nullable=False)
    deadline = Column(DateTime, default=None)
    accepted_at = Column(DateTime, default=None)
    year = Column(Integer, nullable=False)

    supervisor_id = Column(String, ForeignKey("supervisors.id"), nullable=False)

    supervisor = relationship("Supervisor", back_populates="theses")
    applicants = relationship("ThesisApplication", back_populates="thesis")
