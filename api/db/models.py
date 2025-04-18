from sqlalchemy import Column, Integer, String, ForeignKey
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)

class Student(Base):
    __tablename__ = "students"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

class Promoter(Base):
    __tablename__ = "promoters"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

class Thesis(Base):
    __tablename__ = "thesis"
    id = Column(Integer, primary_key=True, index=True)
    promoter_id = Column(Integer, ForeignKey("promoters.id"), nullable=False)
    name = Column(String, index=True)
    description = Column(String, index=True)
    max_students = Column(Integer, index=True)


