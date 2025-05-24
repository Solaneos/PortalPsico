from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from api import models, schemas
from api.database import SessionLocal
from api.routers.usuarios import get_usuario_logado


router = APIRouter(prefix="/clientes", tags=["Clientes"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ✅ Listar clientes
@router.get("/", response_model=list[schemas.ClienteResponse])
def listar_clientes(db: Session = Depends(get_db), usuario=Depends(get_usuario_logado)):
    return db.query(models.Cliente).all()


# ✅ Obter cliente por ID
@router.get("/{cliente_id}", response_model=schemas.ClienteResponse)
def obter_cliente(cliente_id: str, db: Session = Depends(get_db), usuario=Depends(get_usuario_logado)):
    cliente = db.query(models.Cliente).filter_by(id=cliente_id).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    return cliente


# ✅ Criar cliente
@router.post("/", response_model=schemas.ClienteResponse)
def criar_cliente(dados: schemas.ClienteCreate, db: Session = Depends(get_db), usuario=Depends(get_usuario_logado)):
    if db.query(models.Cliente).filter_by(cnpj=dados.cnpj).first():
        raise HTTPException(status_code=400, detail="CNPJ já cadastrado")

    novo_cliente = models.Cliente(
        nome=dados.nome,
        cnpj=dados.cnpj,
        ativo=dados.ativo,
        max_cadastros=dados.max_cadastros
    )
    db.add(novo_cliente)
    db.commit()
    db.refresh(novo_cliente)
    return novo_cliente


# ✅ Atualizar cliente
@router.put("/{cliente_id}", response_model=schemas.ClienteResponse)
def atualizar_cliente(
    cliente_id: str,
    dados: schemas.ClienteCreate,
    db: Session = Depends(get_db),
    usuario=Depends(get_usuario_logado)
):
    cliente = db.query(models.Cliente).filter_by(id=cliente_id).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")

    cliente.nome = dados.nome
    cliente.cnpj = dados.cnpj
    cliente.ativo = dados.ativo
    cliente.max_cadastros = dados.max_cadastros

    db.commit()
    db.refresh(cliente)
    return cliente


@router.delete("/{cliente_id}")
def desativar_cliente(cliente_id: str, db: Session = Depends(get_db), usuario=Depends(get_usuario_logado)):
    cliente = db.query(models.Cliente).filter_by(id=cliente_id).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")

    cliente.ativo = False  # Desativa o cliente
    db.commit()
    return {"detail": "Cliente desativado com sucesso"}

