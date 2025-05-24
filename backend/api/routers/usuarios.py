from fastapi import APIRouter, Depends, HTTPException, status, Form
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from api import models, schemas, auth
from api.database import SessionLocal

router = APIRouter(prefix="/usuarios", tags=["Usuários"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/usuarios/login")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 🔐 Proteção de rota
def get_usuario_logado(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    email = auth.verificar_token(token)
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido ou expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )

    usuario = db.query(models.Usuario).filter_by(email=email).first()

    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    return usuario


# ✅ Listar usuários
@router.get("/", response_model=list[schemas.UsuarioResponse])
def listar_usuarios(db: Session = Depends(get_db), usuario=Depends(get_usuario_logado)):
    return db.query(models.Usuario).all()


# ✅ Obter usuário por ID
@router.get("/{usuario_id}", response_model=schemas.UsuarioResponse)
def obter_usuario(usuario_id: str, db: Session = Depends(get_db), usuario=Depends(get_usuario_logado)):
    user = db.query(models.Usuario).filter_by(id=usuario_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return user


# ✅ Criar usuário
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


# ✅ Atualizar usuário
@router.put("/{usuario_id}", response_model=schemas.UsuarioResponse)
def atualizar_usuario(
    usuario_id: str,
    dados: schemas.UsuarioCreate,
    db: Session = Depends(get_db),
    usuario=Depends(get_usuario_logado)
):
    user = db.query(models.Usuario).filter_by(id=usuario_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    user.nome = dados.nome
    user.cpf = dados.cpf
    user.email = dados.email
    user.tipo = dados.tipo
    user.data_nasc = dados.data_nasc
    user.cliente_id = dados.cliente_id

    # Atualiza a senha apenas se foi enviada (diferente de vazio)
    if dados.senha:
        user.senha = auth.gerar_hash_senha(dados.senha)

    db.commit()
    db.refresh(user)
    return user


# ✅ Deletar usuário
@router.delete("/{usuario_id}")
def deletar_usuario(usuario_id: str, db: Session = Depends(get_db), usuario=Depends(get_usuario_logado)):
    user = db.query(models.Usuario).filter_by(id=usuario_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    db.delete(user)
    db.commit()
    return {"detail": "Usuário deletado com sucesso"}


# ✅ Login
@router.post("/login")
def login(
    username: str = Form(...), 
    password: str = Form(...), 
    db: Session = Depends(get_db)
):
    usuario = db.query(models.Usuario).filter_by(email=username).first()
    if not usuario or not auth.verificar_senha(password, usuario.senha):
        raise HTTPException(status_code=401, detail="Credenciais inválidas")

    token = auth.criar_token({
        "sub": usuario.email,
        "tipo": usuario.tipo.value
    })

    return {"access_token": token, "token_type": "bearer"}


# ✅ Perfil
@router.get("/me", response_model=schemas.UsuarioResponse)
def perfil(usuario=Depends(get_usuario_logado)):
    return usuario
