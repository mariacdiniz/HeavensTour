# HeavensTour — Backend API

API REST Node.js + Express + MongoDB para gestão de aeronaves (desafio Sonda full stack).

## Stack

- **Node.js 20+** · Express 4
- **MongoDB** · Mongoose
- **JWT** · bcrypt
- **Zod** — validação HTTP
- **Multer** — upload
- **AWS SDK v3** — S3 ou **LocalStack** (Docker)
- **Swagger** — `/api-docs`
- **Jest** + **Supertest** — testes
- **Pino** — logs
- **Docker Compose** — Mongo + LocalStack + API

## Estrutura

```text
backend/
├── app/
│   ├── controllers/
│   ├── docs/          # Swagger OpenAPI
│   ├── integrations/  # S3, Mongo helpers
│   ├── middlewares/
│   ├── models/
│   ├── observability/
│   ├── schemas/       # Zod
│   ├── services/
│   ├── useCase/
│   └── utils/
├── config/
├── monitoring/
├── routes/
├── scripts/           # seed, wait-deps
├── tests/
├── docker-compose.yml
└── index.js
```

## Windows 11 — desenvolvimento local

### 1. Pré-requisitos

- [Node.js 20+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (WSL2 backend) — **precisa estar aberto e rodando**

#### Erro: `dockerDesktopLinuxEngine: The system cannot find the file specified`

Significa que o **Docker Desktop não está em execução**. Faça:

1. Abra **Docker Desktop** pelo menu Iniciar e aguarde o ícone da baleia ficar **verde/estável** (pode levar 1–2 min).
2. Em *Settings → General*, marque **Start Docker Desktop when you sign in** (opcional).
3. Confirme no PowerShell:

```powershell
docker version
docker compose version
```

Se `docker version` falhar, reinicie o PC ou reinstale o Docker Desktop com backend **WSL 2**.

### 2. Subir MongoDB (Docker)

```powershell
cd C:\Users\Maria\Projects\HeavensTour\backend
copy .env.example .env
docker compose -f docker-compose.mongo-only.yml up -d
```

Ou apenas o serviço do compose principal:

```powershell
docker compose up -d mongo
```

### 3. Instalar e rodar API (host Windows)

```powershell
npm install
npm run seed
npm run dev
```

- API: http://localhost:3333  
- Swagger: http://localhost:3333/api-docs  
- Health: http://localhost:3333/health  

### 4. Stack completa (API + Mongo + LocalStack S3)

**Com Docker Desktop rodando:**

```powershell
copy .env.example .env
docker compose down
docker compose build --no-cache api
docker compose up -d
docker compose logs -f api
```

Se aparecer `Cannot find module 'express-async-errors'`, reconstrua a imagem após `npm install` na pasta `backend`:

```powershell
npm install
docker compose build --no-cache api
docker compose up -d api
```

#### Alternativa sem Docker na API (mais simples no Windows)

```powershell
docker compose -f docker-compose.mongo-only.yml up -d
npm install
npm run seed
npm run dev
```

No `.env`: `UPLOAD_MODE=local` e `MONGO_URI=mongodb://localhost:27017/heavenstour`

Ver logs no Docker (Windows):

```powershell
docker compose logs -f api
docker compose logs -f mongo
```

## Variáveis de ambiente

| Variável | Descrição |
|----------|-----------|
| `PORT` | Porta da API (3333) |
| `MONGO_URI` | Connection string MongoDB |
| `JWT_SECRET` | Chave JWT (mín. 32 chars em produção) |
| `FRONTEND_URL` | CORS — URL do React (5173) |
| `UPLOAD_MODE` | `local` ou `s3` |
| `UPLOAD_DIR` | Pasta local de uploads |
| `AWS_*` | Credenciais/endpoint S3 ou LocalStack |

## Endpoints (desafio)

| Método | Rota | Auth |
|--------|------|------|
| POST | `/auth/register` | — |
| POST | `/auth/login` | — |
| GET | `/aeronaves` | JWT |
| GET | `/aeronaves/search` | JWT |
| GET | `/aeronaves/:id` | JWT |
| POST | `/aeronaves` | JWT |
| PUT | `/aeronaves/:id` | JWT |
| DELETE | `/aeronaves/:id` | JWT admin |
| POST | `/aeronaves/:id/upload` | JWT (multipart `imagem`) |
| GET | `/relatorios/dashboard` | JWT |

## Credenciais seed

- **Admin:** `admin@heavenstour.com` / `admin123`
- **User:** `user@heavenstour.com` / `user123`

## Testes

```powershell
npm test
```

- Unitários: ICAO, autonomia, fabricante
- Integração: auth, CRUD aeronaves, relatórios, permissões (in-memory MongoDB)

## Decisões técnicas

- **MongoDB:** documentos + aggregation para relatórios por década/fabricante
- **ICAO único** + validação da inicial da marca no `pre('validate')`
- **Upload local** por padrão no Windows (sem LocalStack); S3 via Docker Compose
- **Senha:** aceita `senha` ou `password` no body (compatível com front)

## Melhorias futuras

- Filas Bull para processamento assíncrono
- Refresh token
- Rate limiting por IP
- CI GitHub Actions com `docker compose` nos testes e2e
