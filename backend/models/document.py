from sqlalchemy import Column, String, DateTime, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID as pgUUID
from sqlalchemy.dialects.sqlite import BLOB
from sqlalchemy.sql import func
from database import Base
import uuid
from database.mongodb import files_collection


class Document(Base):
    __tablename__ = "documents"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = Column(Integer, ForeignKey("patients.id"))
    uploaded_by = Column(Integer, ForeignKey("users.id"))
    doctor_id = Column(Integer, ForeignKey("doctors.id"))
    doc_type = Column(String)
    raw_text = Column(String)
    corrected_text = Column(String)
    summary = Column(String)
    diagnosis = Column(String)
    snomed_codes = Column(String)  # Store as CSV for simplicity
    created_on = Column(DateTime(timezone=True), server_default=func.now())
