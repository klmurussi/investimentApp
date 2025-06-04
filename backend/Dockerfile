# Troque alpine por Debian slim
FROM node:18-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

# Instalar netcat e cliente MySQL
RUN apt-get update && apt-get install -y default-mysql-client netcat-openbsd && apt-get clean

COPY wait-and-start.sh .
RUN chmod +x wait-and-start.sh

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 3000
