# API RESTful para CRUD de Usuários

Uma aplicação usando Node.js, TypeScript, MySQL, Docker e Swagger para documentação da API.

## Índice

- [Introdução](#introdução)
- [Instalação](#instalação)
- [Uso](#uso)
- [Documentação da API](#documentação-da-api)
- [Testes](#testes)
- [Diferenciais](#diferenciais)

## Introdução

Esta API RESTful permite realizar operações CRUD (Create, Read, Update, Delete) em usuários. A aplicação utiliza Node.js com TypeScript, MySQL como banco de dados, Docker para containerização e Swagger para documentação da API.

## Instalação

### Pré-requisitos

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/)

### Configuração

1. **Clone o repositório:**

    ```bash
    git clone git@github.com:francysreymer/rest-api-with-mysql-node.git
    cd rest-api-with-mysql-node
    ```

2. **Configure as variáveis de ambiente:**

    Dentro da pasta do projeto, copie o arquivo `.env.example` e renomeie-o para `.env`. Defina as variáveis de ambiente conforme necessário.

3. **Instale as dependências:**

    ```bash
    npm install
    ```

4. **Inicie os containers Docker:**

    ```bash
    docker compose up -d
    ```

5. **Inicie o servidor:**

    ```bash
    npm start
    ```

## Uso

A API estará acessível em [http://localhost:3000/api/users](http://localhost:3000/api/users).

### Endpoints

- **GET /api/users**: Retorna uma lista de usuários.
- **GET /api/users/:id**: Retorna um usuário pelo ID.
- **POST /api/users**: Cria um novo usuário.
- **PUT /api/users/:id**: Atualiza um usuário existente pelo ID.
- **DELETE /api/users/:id**: Deleta um usuário pelo ID.

## Documentação da API

A documentação da API está disponível em [http://localhost:3000/api-docs](http://localhost:3000/api-docs).

### Exemplo de Esquema de Usuário

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "role": "admin"
}
```

## Diferenciais

- **Injeção de Dependências com Inversify**: Utilizamos o pacote Inversify para gerenciar a injeção de dependências, facilitando a modularização e testabilidade do código.
- **TypeScript com Prettier e ESLint**: O projeto é desenvolvido em TypeScript, garantindo tipagem estática e maior segurança no código. Utilizamos Prettier e ESLint para manter a consistência e qualidade do código.
- **Organização do Código e SOLID**: O código é organizado seguindo os princípios SOLID, garantindo um design de software robusto e fácil de manter.
- **Swagger para Documentação**: Utilizamos Swagger para gerar a documentação da API de forma automática, facilitando o entendimento e uso da API por outros desenvolvedores.
- **Cache com Redis para Performance**: Implementamos cache com Redis para melhorar a performance da API, reduzindo a carga no banco de dados e acelerando as respostas.
- **Testes Automatizados e de Integração**: Implementamos testes automatizados e de integração para garantir a qualidade e a funcionalidade correta da API.
- **BaseService e BaseRepository**: Criamos um serviço e repositório base que permitem a implementação de CRUDs para outros cadastros com pouco esforço. Este diferencial é especialmente importante, pois permite a reutilização de código e acelera o desenvolvimento de novas funcionalidades.