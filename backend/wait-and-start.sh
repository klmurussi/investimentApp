#!/bin/sh

echo "⏳ Aguardando o banco de dados ficar disponível..."
until nc -z db 3306; do
  echo "⏳ MySQL ainda não disponível, tentando novamente em 2 segundos..."
  sleep 2
done
echo "✅ Banco de dados disponível!"

npx prisma migrate deploy
npx prisma generate
echo "Prisma migrations applied."

echo "🚀 Iniciando o servidor..."
npm run build
npm run start