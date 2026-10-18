#!/bin/sh
set -e

echo "==> Aplicando migraciones de Prisma..."
npx prisma migrate deploy

echo "==> Migraciones OK. Iniciando la aplicación..."
exec node dist/index.js