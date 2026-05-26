# HeavensTour — Frontend

Interface React para gestão de aeronaves (desafio técnico full stack).

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS 4 — tema escuro aeronáutico + glassmorphism
- **Three.js** + `@react-three/fiber` + `@react-three/drei` (Stars, OrbitControls, Environment)
- Framer Motion — entradas `whileInView` e hover discreto (`y: -3`, sem scale exagerado)
- Recharts — BarChart (década) + PieChart (fabricante)
- React Router 7 — site institucional + área `/app/*`
- TanStack Query · React Hook Form + Zod

## Como rodar (Windows 11)

```powershell
cd frontend
copy .env.example .env
npm install
npm run dev
```

Acesse: http://localhost:5173

### Navegação

| Rota | Conteúdo |
|------|----------|
| `/` | Home com hero 3D |
| `/plataforma` | Módulos da solução |
| `/sobre` | Quem somos |
| `/contato` | Formulário |
| `/login` | JWT (mock) |
| `/app/dashboard` | Relatórios + cena 3D |
| `/app/aeronaves` | Cards com foto + upload |

### Modelo 3D GLB (opcional)

Coloque `public/models/aircraft.glb` — ver `public/models/README.md`. Sem arquivo, usa jato procedural.

### Credenciais demo (mock local)

| Perfil | E-mail | Senha |
|--------|--------|-------|
| Admin | admin@heavenstour.com | admin123 |
| User | user@heavenstour.com | user123 |

## Estrutura

```text
src/
├── api/           # client axios + mock (até backend)
├── components/    # UI, layout, aircraft, dashboard, hero
├── contexts/      # Auth, Toast
├── data/          # constantes e seeds
├── hooks/
├── pages/
├── routes/
├── types/
├── utils/
└── validations/
```

## Deploy Vercel

1. Repositório: https://github.com/mariacdiniz/HeavensTour
2. Vercel → Import → **Root Directory:** `frontend`
3. Build: `npm run build` | Output: `dist`
4. Variável: `VITE_API_URL` = URL da API quando o backend estiver no ar

## Próximo passo

Conectar `USE_MOCK = false` em `src/api/aircraft.api.ts` e `auth.api.ts` quando a API Node estiver disponível.
