from pydantic import BaseModel, EmailStr
from typing import Optional
from enum import Enum
from datetime import date

# ----------- Enum -----------
class TipoUsuario(str, Enum):
    MASTER = "MASTER"
    ADMIN = "ADMIN"
    FUNC = "FUNC"

# ----------- Cliente -----------
class ClienteBase(BaseModel):
    nome: str
    cnpj: str
    ativo: Optional[bool] = True
    max_cadastros: int
    emailrh: Optional[str] = None

class ClienteCreate(ClienteBase):
    pass

class ClienteResponse(ClienteBase):
    id: str

    class Config:
        from_attributes = True

# ----------- Usuário -----------
class UsuarioBase(BaseModel):
    nome: str
    cpf: str
    email: EmailStr
    tipo: TipoUsuario = TipoUsuario.FUNC
    data_nasc: Optional[date] = None

class UsuarioCreate(UsuarioBase):
    senha: str
    cliente_id: Optional[str] = None

class UsuarioLogin(BaseModel):
    email: EmailStr
    senha: str

class UsuarioResponse(UsuarioBase):
    id: str
    concluido: bool
    cliente_id: Optional[str] = None

    class Config:
        from_attributes = True


# ----------- Aula -----------
class AulaBase(BaseModel):
    nome: str
    link: str
    sequencia: int

class AulaCreate(BaseModel):
    nome: str
    link: str
    sequencia: int

class AulaResponse(BaseModel):
    id: str
    nome: str
    link: str
    sequencia: int

    class Config:
        from_attributes = True

