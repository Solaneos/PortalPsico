from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routers import clientes, usuarios, aulas

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(clientes.router)
app.include_router(usuarios.router)
app.include_router(aulas.router)

@app.get("/")
def root():
    return {"message": "API de Videoaulas Online"}
