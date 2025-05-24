from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Caminho absoluto até o .env
env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".env"))
load_dotenv(dotenv_path=env_path)

# Mostra o que foi carregado
print("📂 .env carregado de:", env_path)

DATABASE_URL = os.getenv("DATABASE_URL")
print("🔐 DATABASE URL:", DATABASE_URL)

# Criação da engine
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
