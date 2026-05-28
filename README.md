# ✈️ HeavensTour — Aircraft Management System

> Plataforma completa para gestão de frotas aeronáuticas. Catálogo de aeronaves com código ICAO validado, cálculo automático de autonomia de voo, relatórios consolidados e controle de acesso por perfil de usuário.

**Repositório:** https://github.com/mariacdiniz/HeavensTour

---

## Índice

- [Arquitetura](#arquitetura)
- [Tecnologias utilizadas](#tecnologias-utilizadas)
- [Como rodar o projeto](#como-rodar-o-projeto)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Endpoints da API](#endpoints-da-api)
- [Regras de negócio](#regras-de-negócio)
- [Decisões técnicas](#decisões-técnicas)
- [Testes](#testes)
- [Melhorias futuras](#melhorias-futuras)

---

## Arquitetura

O back-end organiza regras de negócio em camadas (controllers → services/use cases → models), mantendo validações de domínio (ICAO, autonomia, fabricante) em utilitários testáveis independentes do Express.

```
┌─────────────────────────────────────────────────────────┐
│              PRESENTATION — React + Vite                │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP (CORS)
┌──────────────────────▼──────────────────────────────────┐
│  API — Node.js + Express (porta 3333)                   │
│  ├── routes/          Rotas HTTP                          │
│  ├── app/controllers  Adaptadores HTTP                  │
│  ├── app/services     Regras e persistência             │
│  ├── app/useCase      Auth (login/register)             │
│  ├── app/models       Mongoose schemas                  │
│  └── app/docs         OpenAPI + Swagger UI              │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│  INFRASTRUCTURE                                         │
│  MongoDB :27017 │ LocalStack S3 :4566 (opcional)        │
└─────────────────────────────────────────────────────────┘
```

### Estrutura de pastas

```
HeavensTour/
├── .gitignore
├── README.md
│
├── backend/
│   ├── index.js                 ← entrada da API
│   ├── worker.js
│   ├── bull-board.js
│   ├── package.json
│   ├── package-lock.json
│   ├── jest.config.js
│   ├── nodemon.json
│   ├── Dockerfile
│   ├── .env.example
│   ├── .editorconfig
│   ├── .gitignore
│   ├── README.md
│   ├── TESTING.md
│   ├── deploy.sh
│   ├── docker-compose.yml
│   ├── docker-compose.mongo-only.yml
│   ├── docker-compose.staging.yml
│   │
│   ├── config/
│   │   ├── env.js               ← variáveis + CORS
│   │   ├── database.js          ← conexão MongoDB
│   │   └── jwt.js
│   │
│   ├── routes/
│   │   ├── index.js             ← /, /health, montagem das rotas
│   │   ├── auth.routes.js
│   │   ├── aircraft.routes.js
│   │   └── report.routes.js
│   │
│   ├── app/
│   │   ├── factory.js           ← monta Express (CORS, Swagger, rotas)
│   │   ├── zod-extend.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── aircraft.controller.js
│   │   │   └── report.controller.js
│   │   ├── services/
│   │   │   ├── auth.service.js
│   │   │   ├── aircraft.service.js
│   │   │   ├── report.service.js
│   │   │   └── upload.service.js
│   │   ├── useCase/
│   │   │   └── auth/
│   │   │       ├── login.useCase.js
│   │   │       └── register.useCase.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Aircraft.js
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   ├── role.middleware.js
│   │   │   ├── validate.middleware.js
│   │   │   └── errorHandler.middleware.js
│   │   ├── schemas/
│   │   │   ├── auth.schema.js
│   │   │   └── aircraft.schema.js
│   │   ├── utils/
│   │   │   ├── icao.js
│   │   │   ├── autonomy.js
│   │   │   ├── manufacturer.js
│   │   │   └── ownerFilter.js
│   │   ├── integrations/
│   │   │   └── s3Client.js
│   │   ├── observability/
│   │   │   └── logger.js
│   │   └── docs/
│   │       └── swagger.js
│   │
│   ├── scripts/
│   │   ├── seed.js
│   │   └── wait-deps.js
│   │
│   ├── monitoring/
│   │   └── health.js
│   │
│   └── tests/
│       ├── setup.js
│       ├── unit/
│       │   ├── icao.test.js
│       │   ├── autonomy.test.js
│       │   └── manufacturer.test.js
│       └── integration/
│           ├── auth.test.js
│           └── aircraft.test.js
│
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig.json
    ├── tsconfig.app.json
    ├── tsconfig.node.json
    ├── eslint.config.js
    ├── components.json
    ├── vercel.json
    ├── .env.example
    ├── .gitignore
    ├── README.md
    │
    ├── public/
    │   ├── favicon.svg
    │   ├── icons.svg
    │   └── models/
    │
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── index.css
        │
        ├── api/
        │   ├── client.ts
        │   ├── auth.api.ts
        │   ├── aircraft.api.ts
        │   └── mock-store.ts
        │
        ├── assets/              ← imagens do site
        │
        ├── components/
        │   ├── aircraft/        ← formulário, tabela, filtros, upload
        │   ├── brand/
        │   ├── dashboard/       ← gráficos e cards de métricas
        │   ├── layout/          ← PublicLayout, AppShell, sidebar, header
        │   ├── motion/
        │   └── ui/              ← botões, inputs, card, etc.
        │
        ├── contexts/
        │   ├── AuthContext.tsx
        │   ├── ThemeContext.tsx
        │   └── ToastContext.tsx
        │
        ├── data/
        │   ├── constants.ts
        │   ├── media.ts
        │   ├── aircraft-filters.ts
        │   └── mock-aircraft.ts
        │
        ├── hooks/
        │   ├── useAircrafts.ts
        │   └── useDebouncedValue.ts
        │
        ├── lib/
        │   └── utils.ts
        │
        ├── pages/
        │   ├── public/          ← Home, Plataforma, Sobre, Contato
        │   ├── LoginPage.tsx
        │   ├── RegisterPage.tsx
        │   ├── DashboardPage.tsx
        │   ├── AircraftListPage.tsx
        │   ├── AircraftFormPage.tsx
        │   └── NotFoundPage.tsx
        │
        ├── routes/
        │   ├── AppRoutes.tsx
        │   ├── ProtectedRoute.tsx
        │   └── LazyAircraftScene.tsx
        │
        ├── three/
        │   └── AircraftScene.tsx
        │
        ├── types/
        │   ├── auth.ts
        │   ├── aircraft.ts
        │   └── reports.ts
        │
        ├── utils/
        │   ├── autonomy.ts
        │   ├── format.ts
        │   ├── file.ts
        │   └── imageUrl.ts
        │
        └── validations/
            ├── auth.schema.ts
            ├── register.schema.ts
            └── aircraft.schema.ts
```

---

## Tecnologias utilizadas

### Back-end

| Tecnologia | Motivo da escolha |
|---|---|
| Node.js 20 + Express | Runtime estável, ecossistema rico, ideal para APIs REST |
| MongoDB 7 + Mongoose | Schema flexível; agregações nativas para relatórios |
| Zod | Validação de DTOs e variáveis de ambiente |
| jsonwebtoken + bcryptjs | Autenticação JWT stateless com hash de senhas |
| Pino | Logger estruturado |
| swagger-ui-express | Documentação interativa em `/api-docs` |
| Jest + Supertest | Testes unitários e de integração |
| mongodb-memory-server | Banco em memória nos testes |
| AWS SDK + LocalStack | Upload de imagens compatível com S3 |

### Front-end

| Tecnologia | Motivo da escolha |
|---|---|
| React 18 + Vite | SPA com HMR rápido |
| React Router v6 | Rotas públicas e área `/app/*` |
| TanStack Query | Server state com cache e refetch |
| Zustand / Context | Estado de autenticação |
| React Hook Form + Zod | Formulários com validação |
| Three.js + R3F | Cena 3D do dashboard |
| Recharts | Gráficos dos relatórios |
| Framer Motion | Animações de interface |

### Infraestrutura

| Tecnologia | Motivo da escolha |
|---|---|
| Docker Compose | MongoDB, API e LocalStack reproduzíveis |
| LocalStack | S3 local sem conta AWS |

---

## Como rodar o projeto

### Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) `>= 24` (opcional, recomendado)
- [Node.js](https://nodejs.org/) `>= 20`
- [Git](https://git-scm.com/)

### 1. Clone o repositório

```bash
git clone https://github.com/mariacdiniz/HeavensTour.git
cd HeavensTour
```

### 2. Configure as variáveis de ambiente

```powershell
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env
```

### 3a. Stack Docker (API + Mongo + LocalStack)

```powershell
cd backend
docker compose up -d --build
docker compose ps
```

### 3b. Desenvolvimento local (Mongo via Docker)

```powershell
cd backend
docker compose -f docker-compose.mongo-only.yml up -d
npm install
npm run seed
npm run dev
```

```powershell
cd frontend
npm install
npm run dev
```

### 4. Acesse

| Serviço | URL |
|---|---|
| Site / Plataforma | http://localhost:5173 |
| API | http://localhost:3333 |
| Documentação (Swagger) | http://localhost:3333/api-docs |
| Raiz da API (metadados) | http://localhost:3333/ |

### Comandos Docker úteis

```powershell
docker compose logs -f api
docker compose exec api npm run test
docker compose up -d --build api
docker compose down -v
```

---

## Variáveis de ambiente

### `backend/.env.example`

```env
NODE_ENV=development
PORT=3333
MONGO_URI=mongodb://localhost:27017/heavenstour
JWT_SECRET=altere-esta-chave-em-producao-min-32-chars
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
UPLOAD_MODE=local
UPLOAD_DIR=uploads
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
AWS_ENDPOINT=http://localhost:4566
AWS_PUBLIC_ENDPOINT=http://localhost:4566
AWS_BUCKET=heavens-tour-aircraft
```

### `frontend/.env.example`

```env
VITE_API_URL=http://localhost:3333
```

### Ambiente de desenvolvimento (após `npm run seed`)

| Perfil | E-mail | Senha |
|--------|--------|-------|
| Admin | `admin@heavenstour.com` | `admin123` |
| Operador | `user@heavenstour.com` | `user123` |

---

## Endpoints da API

Documentação interativa: http://localhost:3333/api-docs

### Autenticação

| Método | Endpoint | Autenticação |
|---|---|---|
| POST | `/auth/register` | ❌ público |
| POST | `/auth/login` | ❌ público |

### Aeronaves

| Método | Endpoint | Perfil mínimo |
|---|---|---|
| GET | `/aeronaves` | user |
| GET | `/aeronaves/:id` | user |
| GET | `/aeronaves/search` | user |
| POST | `/aeronaves` | user |
| PUT | `/aeronaves/:id` | user |
| DELETE | `/aeronaves/:id` | **admin** |
| POST | `/aeronaves/:id/upload` | user |

### Relatórios

| Método | Endpoint |
|---|---|
| GET | `/relatorios/nao-vendidas` |
| GET | `/relatorios/por-decada` |
| GET | `/relatorios/por-fabricante` |
| GET | `/relatorios/ultima-semana` |
| GET | `/relatorios/dashboard` |

---

## Regras de negócio

### Código ICAO

4 caracteres alfanuméricos maiúsculos. O primeiro deve ser a inicial do fabricante.

| Aeronave | Fabricante | ICAO | Válido |
|---|---|---|---|
| 737-800 | Boeing | B738 | ✅ |
| E175 | Embraer | E175 | ✅ |
| 737-800 | Boeing | E175 | ❌ inicial errada |

### Cálculo de autonomia

```
autonomia (km) = capacidadeCombustivel (L) × consumoMedio (km/L)
```

| Classificação | Faixa |
|---|---|
| Curta | até 3.000 km |
| Média | 3.001 a 7.000 km |
| Longa | acima de 7.000 km |

### Isolamento de dados por usuário

Cada usuário vê e gerencia apenas as aeronaves que cadastrou (`criadoPor`).
Administradores têm visibilidade total da plataforma.

### Unicidade

Não é permitido cadastrar dois registros com o mesmo `icaoCode`.

### Normalização de fabricante

O nome do fabricante é normalizado (trim + case) para evitar duplicatas como "boeing" e "Boeing".

---

## Decisões técnicas

**Camadas no back-end:** Controllers finos delegam a services; auth usa use cases dedicados; utilitários (`icao`, `autonomy`, `manufacturer`) concentram regras testáveis sem acoplar ao Mongoose.

**MongoDB:** Schema flexível para aeronaves; Aggregation Pipeline para relatórios por década e fabricante.

**Isolamento por `criadoPor`:** Filtro aplicado em listagens, buscas, CRUD, upload e relatórios; admin ignora o filtro.

**Upload em duas etapas:** `POST /aeronaves` sem imagem base64 (evita 413); `POST /aeronaves/:id/upload` envia o arquivo.

**LocalStack:** Mesmo código de upload que produção S3 — só mudam endpoint e credenciais.

**Feature-based no front-end:** `features/auth`, `features/aircraft`, `features/dashboard` agrupam UI e lógica por domínio.

---

## Testes

Guia detalhado: [backend/TESTING.md](./backend/TESTING.md)

```powershell
cd backend
npm test
npm run test:unit
npm run test:int
npm run coverage
```

| Camada | Tipo | Ferramenta |
|---|---|---|
| ICAO, autonomia, fabricante | Unitário | Jest |
| Rotas HTTP + auth + isolamento | Integração | Jest + Supertest + mongodb-memory-server |

---

## Melhorias futuras

- **Notificações em tempo real** para eventos da frota (venda, cadastro, alterações críticas).
- **Changelog na interface** com histórico de versões da plataforma.
- **Design system** evoluído com maior consistência entre telas públicas e área logada.
