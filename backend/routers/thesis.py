from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas, database
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from ..database import get_db

router = APIRouter(
    prefix="/theses",
    tags=["theses"]
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == token).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/create", response_model=schemas.ThesisCreate)
def create_thesis(thesis: schemas.ThesisCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != "professor":
        raise HTTPException(status_code=403, detail="Only professors can add theses")

    supervisor = db.query(models.User).filter(models.User.id == thesis.supervisor_id).first()
    if not supervisor:
        raise HTTPException(status_code=404, detail="Supervisor not found")

    student = db.query(models.User).filter(models.User.id == thesis.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    new_thesis = models.Thesis(**thesis.model_dump())
    db.add(new_thesis)
    db.commit()
    db.refresh(new_thesis)
    return new_thesis
