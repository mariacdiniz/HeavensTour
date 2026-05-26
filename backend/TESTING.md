# Como testar o HeavensTour

## Opção 1 — Swagger UI (recomendado para exploração)

1. Com o projeto rodando, acesse: http://localhost:3333/api-docs
2. Clique em `POST /auth/register` → Execute → crie um usuário
3. Clique em `POST /auth/login` → Execute → copie o `token` da resposta
4. Clique em **Authorize** 🔒 no topo da página
5. Digite `Bearer SEU_TOKEN` → Authorize → Close
6. Agora todas as rotas protegidas funcionam no Swagger

## Ambiente de desenvolvimento (após seed)

| Perfil | E-mail | Senha |
|--------|--------|-------|
| Admin | `admin@heavenstour.com` | `admin123` |
| Operador | `user@heavenstour.com` | `user123` |

## Opção 2 — Jest (testes automatizados)

```bash
# Rodar todos os testes
docker compose exec api npm run test

# Apenas testes unitários
docker compose exec api npm run test:unit

# Apenas testes de integração
docker compose exec api npm run test:int

# Cobertura de código
docker compose exec api npm run coverage

# Modo watch (fora do Docker)
cd backend && npm run test:watch
```

## Opção 3 — cURL manual

### Criar usuário
```bash
curl -X POST http://localhost:3333/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nome":"Ana Lima","email":"ana@exemplo.com","senha":"Senha@123","role":"admin"}'
```

### Login e capturar token
```bash
TOKEN=$(curl -s -X POST http://localhost:3333/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ana@exemplo.com","senha":"Senha@123"}' | jq -r '.token')
```

### Listar aeronaves
```bash
curl -X GET http://localhost:3333/aeronaves \
  -H "Authorization: Bearer $TOKEN"
```

### Criar aeronave
```bash
curl -X POST http://localhost:3333/aeronaves \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Boeing 737-800",
    "marca": "Boeing",
    "ano": 2018,
    "icaoCode": "B738",
    "vendido": false,
    "capacidadeCombustivel": 26020,
    "consumoMedio": 0.38,
    "descricao": "Narrowbody de médio alcance"
  }'
```

## Visualizar logs em tempo real (Docker)

```bash
# Logs do back-end
docker compose logs -f api

# Logs formatados (requer jq)
docker compose logs -f api | jq .

# Apenas erros (com logger JSON)
docker compose logs api | grep '"level":"error"'
```
