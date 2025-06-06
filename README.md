## Modo dev

Rodar o db com docker:
```bash
sudo docker-compose up -d db
```

Instalando dependências:
```bash
cd backend
npm install

cd ../frontend
npm install
```

Rodando o backend:
```bash
cd backend
npx prisma generate
npm run dev
```

Rodando o frontend:
```bash
cd frontend
npm run dev
```

## Com Docker Compose
### Requisitos
- Docker
- Docker Compose
- Node.js (opcional, para desenvolvimento)
### Instruções
1. Clone o repositório:
```bash
git clone
example.com/repo.git
cd repo
```
2. Crie um arquivo `.env` baseado no `.env.example`:
```bash
cp .env.example .env
```
3. Edite o arquivo `.env` conforme necessário, especialmente as variáveis de ambiente relacionadas ao banco de dados.
4. Execute os seguintes comandos para iniciar o ambiente:
```bash
sudo docker-compose up -d
```
5. Acesse a aplicação em `http://localhost:3000` ou conforme configurado no arquivo `.env`.
6. Para parar os containers, use:
```bash
sudo docker-compose down
```

Para modo de desenvolvimento, você pode usar o seguinte comando para permitir recarregamento automático das alterações no código:
```bash
sudo docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```