# Docker Setup for Tibia XP Calculator

Este repositório contém a configuração Docker para o projeto Tibia XP Calculator, incluindo um banco de dados PostgreSQL e opcionalmente a aplicação Next.js.

## Requisitos

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Estrutura

- `docker-compose.yml`: Configuração para o PostgreSQL e pgAdmin
- `Dockerfile`: Configuração para a aplicação Next.js (opcional)

## Configuração do Banco de Dados

O arquivo `docker-compose.yml` configura um banco de dados PostgreSQL com as seguintes credenciais:

- **Host**: localhost (ou postgres dentro da rede Docker)
- **Porta**: 5432
- **Usuário**: postgres
- **Senha**: postgres
- **Banco de Dados**: xptibia

Também inclui o pgAdmin para gerenciamento do banco de dados:

- **URL**: http://localhost:5050
- **Email**: admin@example.com
- **Senha**: admin

## Instruções de Uso

### Iniciar apenas o Banco de Dados

1. Inicie o PostgreSQL e pgAdmin:

```bash
docker-compose up -d postgres pgadmin
```

2. Conecte sua aplicação local ao banco de dados usando as credenciais acima.

3. Execute as migrações para criar as tabelas necessárias:

```bash
# Usando o ambiente Docker no knexfile.ts
NODE_ENV=docker npm run migrate
# ou
NODE_ENV=docker npx knex migrate:latest

# Ou usando variáveis de ambiente
DB_HOST=localhost npm run migrate
```

> **Nota**: O arquivo `knexfile.ts` foi atualizado para suportar diferentes ambientes:
> - `development`: Ambiente de desenvolvimento local (padrão)
> - `production`: Ambiente de produção com pool de conexões
> - `docker`: Configurado para conectar ao serviço "postgres" no Docker
>
> Você pode especificar o ambiente usando a variável `NODE_ENV` ou usar variáveis de ambiente para configurar a conexão:
> - `DB_HOST`: Host do banco de dados (padrão: "localhost")
> - `DB_USER`: Usuário do banco de dados (padrão: "postgres")
> - `DB_PASSWORD`: Senha do banco de dados (padrão: "postgres")
> - `DB_NAME`: Nome do banco de dados (padrão: "xptibia")
> - `DATABASE_URL`: String de conexão completa (opcional)

### Iniciar a Aplicação Completa com Docker (Opcional)

Se você quiser containerizar a aplicação também:

1. Descomente a seção `app` no arquivo `docker-compose.yml`.

2. Construa e inicie todos os serviços:

```bash
docker-compose up -d
```

3. A aplicação estará disponível em: http://localhost:3000

## Acessando o pgAdmin

1. Acesse http://localhost:5050
2. Faça login com:
   - Email: admin@example.com
   - Senha: admin

3. Adicione um novo servidor:
   - Nome: Tibia XP Calculator
   - Host: postgres
   - Porta: 5432
   - Usuário: postgres
   - Senha: postgres
   - Banco de Dados: xptibia

## Volumes e Persistência

Os dados do PostgreSQL e pgAdmin são persistidos em volumes Docker:

- `postgres_data`: Armazena os dados do PostgreSQL
- `pgadmin_data`: Armazena as configurações do pgAdmin

## Customização

### Alterando Credenciais

Para alterar as credenciais do banco de dados, edite as variáveis de ambiente no arquivo `docker-compose.yml`:

```yaml
environment:
  POSTGRES_USER: seu_usuario
  POSTGRES_PASSWORD: sua_senha
  POSTGRES_DB: seu_banco
```

Lembre-se de atualizar também o arquivo `knexfile.ts` para usar as mesmas credenciais.

### Adicionando Scripts de Inicialização

Para adicionar scripts SQL que serão executados na inicialização do banco de dados:

1. Crie um diretório `docker/postgres/init`
2. Adicione seus scripts SQL neste diretório
3. Descomente a linha no `docker-compose.yml`:

```yaml
volumes:
  - ./docker/postgres/init:/docker-entrypoint-initdb.d
```

## Solução de Problemas

### Verificando Logs

```bash
# Logs do PostgreSQL
docker-compose logs postgres

# Logs do pgAdmin
docker-compose logs pgadmin

# Logs da aplicação (se estiver usando Docker)
docker-compose logs app
```

### Reiniciando Serviços

```bash
docker-compose restart postgres
```

### Removendo Volumes para Começar do Zero

```bash
docker-compose down -v
```

**Atenção**: Isso apagará todos os dados do banco de dados!