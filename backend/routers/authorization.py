# backend/routers/authorization.py
from fastapi import APIRouter, Depends, HTTPException, Form
from sqlalchemy.orm import Session
from ..models import User
from ..database import get_db
from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext
from ..config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES  # import z config.py

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    to_encode["exp"] = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login")
def login(
    username: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    # Debug: co przyszło z frontendu
    print(f"Attempting to login with {username=} and {password=}")

    # Szukamy usera po emailu (tutaj email == username)
    user = db.query(User).filter(User.email == username).first()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Nieprawidłowe dane logowania")

    access_token = create_access_token({"sub": user.email, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}
