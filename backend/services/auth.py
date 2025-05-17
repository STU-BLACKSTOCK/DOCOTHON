from sqlalchemy.orm import Session
from models import user as user_model
from schemas import user as user_schema
from utils import password

def get_user_by_aadhaar(db: Session, aadhaar_id: str):
    return db.query(user_model.User).filter(user_model.User.aadhaar_id == aadhaar_id).first()

def create_user(db: Session, user: user_schema.UserCreate):
    hashed_pwd = password.hash_password(user.password)
    db_user = user_model.User(
        aadhaar_id=user.aadhaar_id,
        name=user.name,
        password=hashed_pwd,
        role=user.role.lower()
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
