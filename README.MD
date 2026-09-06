# API Guia de Turismo

O Sistema de Guia de Turismo foi desenvolvido para auxiliar os usuários a conhecerem e desfrutarem o melhor de cada destino de forma ágil, garantindo uma experiência única em suas viagens.

Esta API gerencia e fornece os dados sobre lugares, categorias, galerias de fotos e favoritos, operando como o backend exclusivo para consumo por um aplicativo mobile estruturado em Flutter.

## Tecnologias Utilizadas

- Node.js: Ambiente de execução JavaScript.
- TypeScript: Superset de JavaScript com tipagem estática.
- Express: Framework para roteamento e requisições HTTP.
- Prisma ORM: Ferramenta de mapeamento objeto-relacional.
- Supabase (PostgreSQL): Banco de dados relacional.
- Yarn: Gerenciador de pacotes.

## Arquitetura

O projeto utiliza a seguinte estrutura:

- prisma/: Definição de modelagem de banco de dados (schema.prisma).
- src/
  - controllers/: Gerenciamento de requisições e respostas HTTP.
  - services/: Regras de negócio e acesso a banco de dados.
  - routes/: Definição de endpoints da API.
  - middlewares/: Interceptadores de requisições (autenticação, validação, tratamento de erros, segurança).

## Pré-requisitos

- Node.js (versão 18 ou superior).
- Yarn.
- Banco de dados PostgreSQL (Supabase).

## Instalação e Execução

1. Limpar a instalação atual (em caso de conflitos anteriores, exclua a pasta node_modules e o arquivo yarn.lock)

2. Instalar as dependências do projeto (produção):
   ```bash
   yarn add express cors helmet express-rate-limit swagger-ui-express bcryptjs jsonwebtoken pg @prisma/client@7.10.0 @prisma/adapter-pg@7.10.0
   ```

3. Instalar as dependências de desenvolvimento (tipagens e CLI):
   ```bash
   yarn add -D typescript ts-node-dev tsx @types/node @types/express @types/cors @types/swagger-ui-express @types/bcryptjs @types/jsonwebtoken @types/pg prisma@7.10.0
   ```

4. Configurar variáveis de ambiente. Criar o arquivo `.env` na raiz do projeto com os seguintes dados:
   ```env
   DATABASE_URL="postgresql://usuario:senha@host:porta/banco_de_dados?pgbouncer=true"
   DIRECT_URL="postgresql://usuario:senha@host:porta/banco_de_dados"
   PORT=3000
   JWT_SECRET="chave_secreta"
   ```

5. Sincronizar o schema com o banco de dados (o uso estrito da versão 7.10.0 garantirá o funcionamento correto do comando push):
   ```bash
   yarn prisma db push
   ```

6. Iniciar o servidor em modo de desenvolvimento:
   ```bash
   yarn dev
   ```

O servidor estará disponível por padrão em `http://localhost:3000`.

## Scripts Disponíveis

- `yarn dev`: Inicia o servidor com recarregamento automático via ts-node-dev.
- `yarn build`: Transpila o código TypeScript para JavaScript na pasta /dist.
- `yarn start`: Executa a aplicação a partir do código gerado no build.