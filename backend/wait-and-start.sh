#!/bin/sh

APP_MODE="${APP_MODE:-start}"

echo "⏳ Aguardando o banco de dados ficar disponível..."
until nc -z db 3306; do
  echo "⏳ MySQL ainda não disponível, tentando novamente em 2 segundos..."
  sleep 2
done
echo "✅ Banco de dados disponível!"

npx prisma migrate deploy
echo "Prisma migrations applied. Starting application in $APP_MODE mode..."

if [ "$APP_MODE" = "dev" ]; then
  echo "🚀 Iniciando o servidor em modo de desenvolvimento..."
  exec npm run dev
else
  echo "🚀 Iniciando o servidor..."
  npm run start 
fi