#!/bin/sh

# Espera o banco ficar disponível
echo "⏳ Aguardando o banco de dados ficar disponível..."
until nc -z db 3306; do
  echo "⏳ MySQL ainda não disponível, tentando novamente em 2 segundos..."
  sleep 2
done

echo "✅ Banco de dados disponível!"

# Roda as migrações do Prisma
npx prisma migrate deploy

# Inicia o servidor
npm run build && npm start