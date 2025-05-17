from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.orm import Session
from models.document import Document
from database import get_db
from utils.jwt import get_current_user
from services import ocr, ai_processing
import shutil
import os
from uuid import uuid4
from schemas.document import Document as DocumentSchema

router = APIRouter()

UPLOAD_DIR = "storage/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload", response_model=DocumentSchema)
def upload_document(
    file: UploadFile = File(...),
    patient_id: int = Form(...),
    doc_type: str = Form(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    file_id = str(uuid4())
    file_path = os.path.join(UPLOAD_DIR, f"{file_id}_{file.filename}")
    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    # Mock AI Processing
    raw_text = ocr.extract_text_from_file(file_path)
    corrected = ai_processing.correct_text(raw_text)
    summary = ai_processing.generate_summary(corrected)
    diagnosis = ai_processing.generate_diagnosis(corrected)
    snomed = ai_processing.map_to_snomed(corrected)

    doc = Document(
        id=file_id,
        patient_id=patient_id,
        uploaded_by=current_user.id,
        doctor_id=current_user.id if current_user.role == "doctor" else None,
        doc_type=doc_type,
        raw_text=raw_text,
        corrected_text=corrected,
        summary=summary,
        diagnosis=diagnosis,
        snomed_codes=snomed
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    return doc
