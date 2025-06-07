# 🚀 Sistema de Gerenciamento de Clientes e Ativos (Fullstack)

Este é um projeto fullstack para gerenciar clientes e seus ativos de investimento. A aplicação permite cadastrar clientes, visualizar seus detalhes e alocações de ativos, além de adicionar novos ativos para cada cliente.

## ✨ Funcionalidades

* **Gerenciamento de Clientes (CRUD)**:
    * Listar todos os clientes.
    * Visualizar detalhes de um cliente específico.
    * Cadastrar novos clientes.
* **Gerenciamento de Ativos Financeiros por Cliente**:
    * Listar todos os ativos financeiros de um cliente específico.
    * Cadastrar novos ativos financeiros para um cliente.
* **API RESTful**: Backend robusto para todas as operações.

## 🛠️ Tecnologias Utilizadas

Este projeto utiliza:

* **Frontend**:
    * Next.js 14+
    * React
    * TypeScript
    * Tailwind CSS
    * Shadcn UI
* **Backend**:
    * Node.js
    * Fastify
    * TypeScript
    * Prisma ORM
    * Zod
* **Banco de Dados**:
    * MySQL 8.0: Sistema de gerenciamento de banco de dados relacional.
* **Containerização**:
    * Docker
    * Docker Compose: Para orquestrar os serviços de banco de dados, backend e frontend.

## ⚙️ Configuração e Execução do Projeto

Siga os passos abaixo para configurar e rodar o projeto em sua máquina local.

### Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas em seu ambiente:

* [**Docker Desktop**](https://www.docker.com/products/docker-desktop) (inclui Docker Engine e Docker Compose)
    * Para usuários Linux, certifique-se de que seu usuário está no [grupo `docker`](https://docs.docker.com/engine/install/linux-postinstall/) para executar comandos Docker sem `sudo`.
* [**Node.js**](https://nodejs.org/en) (versão 18.x ou superior, compatível com `node:18-slim` no Dockerfile)
* [**npm**](https://www.npmjs.com/) (gerenciador de pacotes do Node.js)

### Passos de Configuração

1.  **Clone o Repositório:**
    ```bash
    git clone github.com/klmurussi/investimentApp.git
    cd investimentApp
    ```

2.  **Configuração do Backend:**
    * Navegue até a pasta do backend:
        ```bash
        cd backend
        ```
    * Instale as dependências do backend:
        ```bash
        npm install
        ```
    * Crie o arquivo de variáveis de ambiente `.env` na pasta `backend/`. Este arquivo será usado pelo Prisma CLI para conectar ao banco de dados rodando localmente (na sua máquina) e pelo contêiner do backend (apontando para o serviço `db`).

        ```dotenv
        # backend/.env
        DATABASE_URL="mysql://root:password@localhost:3306/investmentDB" # Para uso LOCAL (Prisma CLI)
        # Quando rodando via Docker Compose, o hostname 'db' será usado internamente.
        ```
        > **Importante**: Altere `root:password` e `investmentDB` para as credenciais e nome de banco de dados que você usará no `docker-compose.yml`.

    * **Execute as Migrações do Prisma:**
        Primeiro, inicie apenas o serviço do banco de dados para que o Prisma possa se conectar a ele:
        ```bash
        # Na raiz do projeto
        docker-compose up -d db
        ```
        Aguarde alguns segundos até o banco de dados ficar saudável (`docker ps` deve mostrar `(healthy)`).
        Em seguida, volte para a pasta `backend` e execute as migrações:
        ```bash
        cd backend
        npx prisma migrate dev --name init_database_schema
        npx prisma generate
        ```
        > **Atenção**: Se você alterou a `DATABASE_URL` no `.env` para `localhost`, Lembre-se de **voltar `localhost` para `db`** no `backend/.env` **APÓS** a migração, pois o contêiner do backend precisará desse hostname:
        ```dotenv
        # backend/.env
        DATABASE_URL="mysql://root:password@db:3306/investmentDB" # Para uso no CONTÊINER
        ```

3.  **Configuração do Frontend:**
    * Navegue até a pasta do frontend:
        ```bash
        cd ../frontend # Se você está na pasta backend
        # ou
        # cd frontend # Se você está na raiz do projeto
        ```
    * Instale as dependências do frontend:
        ```bash
        npm install
        ```

### Executando a Aplicação (Com Docker Compose)

Após a configuração inicial, você pode iniciar todos os serviços com um único comando:

1.  **Navegue de volta para a raiz do seu projeto** (onde está o `docker-compose.yml`):
    ```bash
    cd ..
    ```

2.  **Inicie os serviços do Docker Compose:**
    ```bash
    docker-compose up --build -d
    ```
    * `--build`: Garante que as imagens do backend e frontend sejam reconstruídas com seu código mais recente.
    * `-d`: Executa os contêineres em segundo plano.

3.  **Verifique o status dos contêineres:**
    ```bash
    docker ps
    ```
    Todos os contêineres (`mysql_db`, `investment_backend`, `investment_frontend`) devem estar `Up` e o `mysql_db` deve estar `(healthy)`.

4.  **Monitore os logs (opcional, para depuração):**
    * Backend: `docker logs investment_backend -f`
    * Frontend: `docker logs investment_frontend -f`
    Pressione `Ctrl+C` para sair do modo de acompanhamento de logs.

## 🚀 Uso da Aplicação

Uma vez que todos os serviços estejam rodando:

* **Frontend (Aplicação Web):**
    Acesse no seu navegador: [http://localhost:3000](http://localhost:3000)
    * `http://localhost:3000/clients`: Página principal de gerenciamento de clientes.

* **Backend (API Fastify):**
    Acesse diretamente os endpoints da API (ex: via Postman, Insomnia ou `curl`):
    * Base URL: `http://localhost:5000`
    * **Clientes:**
        * `GET /clients`: Listar todos os clientes.
        * `GET /clients/:id`: Obter detalhes de um cliente específico.
        * `POST /clients`: Criar um novo cliente (requer `{ "name", "email", "status" }` no corpo).
    * **Ativos Financeiros:**
        * `GET /assets`: Listar todos os ativos.
        * `GET /assets/:clientID`: Listar ativos de um cliente específico (onde `:clientID` é o ID do cliente).
        * `POST /assets`: Criar um novo ativo (requer `{ "name", "value", "clientID" }` no corpo).

## ✨ Próximas Melhorias (Ideias)

* Implementar `PUT` e `DELETE` para os clientes e ativos financeiros.
* Adicionar autenticação e autorização (login de usuários).
* Melhorar a interface do usuário (UX) com spinners de carregamento mais sofisticados, mensagens de feedback, etc.
* Página de detalhes de um ativo específico (`/assets/:id`).
* Implementar tabelas paginadas ou com filtros na UI.
* Testes unitários e de integração.