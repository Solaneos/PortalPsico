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
    return db.query(models.Aula).order_by(models.Aula.sequencia).all()


@router.post("/", response_model=schemas.AulaResponse)
def criar_aula(aula: schemas.AulaCreate, db: Session = Depends(get_db), usuario=Depends(get_usuario_logado)):
    if usuario.tipo.value != "MASTER":
        raise HTTPException(status_code=403, detail="Apenas administradores podem cadastrar aulas.")

    nova_aula = models.Aula(nome=aula.nome, link=aula.link, sequencia=aula.sequencia)
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


@router.put("/{aula_id}", response_model=schemas.AulaResponse)
def atualizar_aula(
    aula_id: str,
    aula: schemas.AulaCreate,
    db: Session = Depends(get_db),
    usuario=Depends(get_usuario_logado)
):
    if usuario.tipo.value != "MASTER":
        raise HTTPException(status_code=403, detail="Apenas administradores podem atualizar aulas.")

    aula_existente = db.query(models.Aula).filter_by(id=aula_id).first()
    if not aula_existente:
        raise HTTPException(status_code=404, detail="Aula não encontrada.")

    aula_existente.nome = aula.nome
    aula_existente.link = aula.link
    aula_existente.sequencia = aula.sequencia

    db.commit()
    db.refresh(aula_existente)
    return aula_existente


@router.delete("/{aula_id}")
def deletar_aula(
    aula_id: str,
    db: Session = Depends(get_db),
    usuario=Depends(get_usuario_logado)
):
    if usuario.tipo.value != "MASTER":
        raise HTTPException(status_code=403, detail="Apenas administradores podem deletar aulas.")

    aula = db.query(models.Aula).filter_by(id=aula_id).first()
    if not aula:
        raise HTTPException(status_code=404, detail="Aula não encontrada.")

    db.delete(aula)
    db.commit()
    return {"detail": "Aula deletada com sucesso."}
