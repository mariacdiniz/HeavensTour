#!/usr/bin/env sh
# Deploy exemplo — ajuste para seu provedor (Railway, Render, VPS)
set -e
docker compose -f docker-compose.staging.yml up -d --build
echo "Deploy staging iniciado."
