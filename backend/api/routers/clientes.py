from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from api.database import SessionLocal
from api import models, schemas

router = APIRouter(prefix="/clientes", tags=["Clientes"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.ClienteResponse)
def criar_cliente(cliente: schemas.ClienteCreate, db: Session = Depends(get_db)):
    if db.query(models.Cliente).filter_by(cnpj=cliente.cnpj).first():
        raise HTTPException(status_code=400, detail="CNPJ já cadastrado")

    novo = models.Cliente(
        nome=cliente.nome,
        cnpj=cliente.cnpj,
        ativo=cliente.ativo,
        max_cadastros=cliente.max_cadastros
    )
    db.add(novo)
    db.commit()
    db.refresh(novo)
    return novo

@router.get("/", response_model=list[schemas.ClienteResponse])
def listar_clientes(db: Session = Depends(get_db)):
    return db.query(models.Cliente).all()
