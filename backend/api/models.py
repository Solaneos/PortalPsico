from sqlalchemy import Column, String, Boolean, Date, Enum, ForeignKey, Numeric
from sqlalchemy import Integer
from sqlalchemy.orm import relationship
from uuid import uuid4
from enum import Enum as PyEnum
from api.database import Base

def generate_uuid():
    return str(uuid4())

class TipoUsuario(PyEnum):
    MASTER = "MASTER"
    ADMIN = "ADMIN"
    FUNC = "FUNC"

class Cliente(Base):
    __tablename__ = "clientes"

    id = Column(String, primary_key=True, index=True, default=generate_uuid)
    nome = Column(String, nullable=False)
    cnpj = Column(String, unique=True, nullable=False)
    ativo = Column(Boolean, default=True)
    max_cadastros = Column(Integer)
    emailrh = Column(String)

    usuarios = relationship("Usuario", back_populates="cliente")

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(String, primary_key=True, index=True, default=generate_uuid)
    nome = Column(String, nullable=False)
    cpf = Column(String, nullable=False, unique=True)
    email = Column(String, unique=True, nullable=False)
    senha = Column(String, nullable=False)
    tipo = Column(Enum(TipoUsuario), default=TipoUsuario.FUNC)
    data_nasc = Column(Date)
    concluido = Column(Boolean, default=False)
    cliente_id = Column(String, ForeignKey("clientes.id"))

    cliente = relationship("Cliente", back_populates="usuarios")

class Aula(Base):
    __tablename__ = "aulas"

    id = Column(String, primary_key=True, index=True, default=generate_uuid)
    nome = Column(String, nullable=False)
    link = Column(String, nullable=False)
    sequencia = Column(Numeric, nullable=False)
