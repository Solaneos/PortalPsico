from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from api import models, schemas, auth
from api.database import SessionLocal

router = APIRouter(prefix="/usuarios", tags=["Usuários"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="usuarios/login")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Proteção de rota com token
def get_usuario_logado(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    email = auth.verificar_token(token)
    if not email:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido ou expirado")

    usuario = db.query(models.Usuario).filter_by(email=email).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    return usuario

@router.post("/", response_model=schemas.UsuarioResponse)
def criar_usuario(dados: schemas.UsuarioCreate, db: Session = Depends(get_db)):
    if db.query(models.Usuario).filter_by(email=dados.email).first():
        raise HTTPException(status_code=400, detail="Email já cadastrado")

    hash_senha = auth.gerar_hash_senha(dados.senha)
    novo_usuario = models.Usuario(
        nome=dados.nome,
        cpf=dados.cpf,
        email=dados.email,
        senha=hash_senha,
        tipo=dados.tipo,
        data_nasc=dados.data_nasc,
        cliente_id=dados.cliente_id
    )
    db.add(novo_usuario)
    db.commit()
    db.refresh(novo_usuario)
    return novo_usuario

@router.post("/login")
def login(dados: schemas.UsuarioLogin, db: Session = Depends(get_db)):
    usuario = db.query(models.Usuario).filter_by(email=dados.email).first()
    if not usuario or not auth.verificar_senha(dados.senha, usuario.senha):
        raise HTTPException(status_code=401, detail="Credenciais inválidas")

    token = auth.criar_token({"sub": usuario.email})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/me", response_model=schemas.UsuarioResponse)
def perfil(usuario=Depends(get_usuario_logado)):
    return usuario
