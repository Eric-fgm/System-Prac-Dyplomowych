from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from backend.routers import authorization, thesis, user  # Importujemy z backend.routers
from backend import models, database, schemas  # Importujemy z backend

app = FastAPI()

# Dodajemy routery do aplikacji
app.include_router(authorization.router)
app.include_router(thesis.router)
app.include_router(user.router)

# Konfiguracja CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Tworzenie tabel w bazie danych
models.Base.metadata.create_all(bind=database.engine)

# Funkcja do uzyskiwania sesji bazy danych
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()
