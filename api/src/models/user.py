from sqlalchemy import Column, String
from fastapi_users.db import SQLAlchemyBaseUserTableUUID

from ..db import Base

class User(SQLAlchemyBaseUserTableUUID, Base):
    __tablename__ = "users"

    first_name = Column(String)
    last_name = Column(String)