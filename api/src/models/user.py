from sqlalchemy import Integer, Column, String
from fastapi_users.db import SQLAlchemyBaseUserTable
from sqlalchemy.orm import relationship

from ..db import Base

class User(SQLAlchemyBaseUserTable[int], Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)

    first_name = Column(String)
    last_name = Column(String)

    applied_theses = relationship("ThesisApplication", back_populates="user")