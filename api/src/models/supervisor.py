from sqlalchemy import Integer, Column, String, ForeignKey
from sqlalchemy.orm import relationship
import uuid

from ..db import Base


class Supervisor(Base):
    __tablename__ = "supervisors"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    specialization = Column(String, nullable=False)

    user = relationship("User", backref="supervisor")
    theses = relationship("Thesis", back_populates="supervisor")