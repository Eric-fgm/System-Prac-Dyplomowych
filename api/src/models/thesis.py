from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.types import Enum as SAEnum
from sqlalchemy.orm import relationship
from ..db import Base
import enum

class ThesisStatus(str, enum.Enum):
    proposed     = "proposed"
    accepted     = "accepted"
    in_progress  = "in_progress"
    submitted    = "submitted"
    defended     = "defended"
    rejected     = "rejected"

class Thesis(Base):
    __tablename__ = "thesis"

    id            = Column(Integer, primary_key=True, index=True)
    title         = Column(String, nullable=False)
    description   = Column(String, nullable=False)
    status        = Column(
                      SAEnum(ThesisStatus, name="thesis_status", native_enum=False),
                      default=ThesisStatus.proposed,
                      nullable=False
                   )
    supervisor_id = Column(Integer, ForeignKey("supervisors.id"), nullable=False)
    student_id    = Column(Integer, ForeignKey("users.id"),      nullable=False)

    supervisor = relationship("Supervisor", foreign_keys=[supervisor_id], backref="theses")
    student    = relationship("User",       foreign_keys=[student_id],    backref="theses")
