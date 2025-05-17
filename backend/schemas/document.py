from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DocumentBase(BaseModel):
    patient_id: int
    doc_type: str
    raw_text: Optional[str] = None
    corrected_text: Optional[str] = None
    summary: Optional[str] = None
    diagnosis: Optional[str] = None
    snomed_codes: Optional[str] = None

class DocumentCreate(DocumentBase):
    pass

class Document(DocumentBase):
    id: str
    uploaded_by: int
    doctor_id: Optional[int] = None
    created_on: datetime

    class Config:
        from_attributes = True
