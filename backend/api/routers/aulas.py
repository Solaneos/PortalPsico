from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from api.database import SessionLocal
from api import models, schemas
from api.routers.usuarios import get_usuario_logado

router = APIRouter(prefix="/aulas", tags=["Aulas"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=list[schemas.AulaResponse])
def listar_aulas(db: Session = Depends(get_db), usuario=Depends(get_usuario_logado)):
    return db.query(models.Aula).all()

@router.post("/", response_model=schemas.AulaResponse)
def criar_aula(aula: schemas.AulaCreate, db: Session = Depends(get_db), usuario=Depends(get_usuario_logado)):
    if usuario.tipo != "ADMIN":
        raise HTTPException(status_code=403, detail="Apenas administradores podem cadastrar aulas.")

    nova_aula = models.Aula(nome=aula.nome, link=aula.link)
    db.add(nova_aula)
    db.commit()
    db.refresh(nova_aula)
    return nova_aula

@router.get("/{aula_id}", response_model=schemas.AulaResponse)
def obter_aula(aula_id: str, db: Session = Depends(get_db), usuario=Depends(get_usuario_logado)):
    aula = db.query(models.Aula).filter_by(id=aula_id).first()
    if not aula:
        raise HTTPException(status_code=404, detail="Aula não encontrada.")
    return aula
