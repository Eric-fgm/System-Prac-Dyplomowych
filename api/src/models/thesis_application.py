from sqlalchemy import Column, ForeignKey, String
from sqlalchemy.orm import relationship
from ..db import Base

class ThesisApplication(Base):
    __tablename__ = "thesis_applications"

    thesis_id = Column(ForeignKey("thesis.id"), primary_key=True)
    user_id = Column(ForeignKey("users.id"))
    motivation = Column(String)

    thesis = relationship("Thesis", back_populates="applicants")
    user = relationship("User", back_populates="applied_theses")