# Portal Psico 📘🧠

O **Portal Psico** é uma plataforma SaaS desenvolvida para empresas brasileiras atenderem à nova legislação que exige a disponibilização de conteúdo de apoio psicológico e emocional aos seus colaboradores.

## ✨ Objetivo

Oferecer um ambiente digital onde os funcionários possam se cadastrar, assistir a videoaulas sobre saúde mental e obter um certificado de conclusão, fortalecendo o bem-estar no ambiente corporativo.

## 🧩 Estrutura do Projeto

- **frontend/**: Interface desenvolvida em React + Material UI
- **backend/**: API desenvolvida em FastAPI com autenticação via JWT
- **.env**: Arquivo de variáveis sensíveis (não incluso no repositório)

## 🔐 Autenticação

Usuários se cadastram com e-mail e CPF. Após o login, um token JWT é gerado com validade de 2 horas. Usuários do tipo "admin" têm acesso a áreas restritas para gerenciamento de aulas e empresas.

## 🗃️ Banco de Dados

O sistema utiliza SQLite por padrão (em desenvolvimento). As tabelas principais são:

- `clientes`: Cadastro das empresas contratantes
- `usuarios`: Cadastro dos funcionários
- `aulas`: Videoaulas disponíveis

## 🔧 Como rodar localmente

```bash
# Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn api.main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

## 📦 Deployment

Futuramente será possível realizar deploy automático via Docker e integração com banco de dados PostgreSQL para produção.

---

> Desenvolvido por Nikolas Monteiro 💻
