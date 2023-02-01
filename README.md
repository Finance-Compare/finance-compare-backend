# Desenvolvimento da API

Para criarmos o projeto do zero, devemos inicar com e configurar o nosso projeto, adicionando o nome do pacote, a versão, autor e entre outras informações:

>$ npm init

Após configurado o projeto devemos instalar a dependência **express** a partir de:

>$ npm install express

# Entendedo a API

Para se comunicar com uma API (Application Programming Interface) temos dois recursos principais as rotas e os recursos.

## Rotas 

As rotas são utilizadas para se comunicar com a nossa aplicação.

## Recursos

Recursos são os nomes das rotas dentro de nosso programa, por exemplo: 

```javascript

const express = require('express');

const app = express();

app.get('/users', (request, response) => {
    return response.json({
        aluno: 'Josue Lopes'
    });
});

app.listen(3333);

```

Utilizando o exemplo acima para explanar melhor a rota da nossa *API* utilizando o endereço *LocalHost* seria *localhost:3333/users* e o nosso recurso seria */users*

## Métodos HTTP

Quando trabalhamos com a Web temos que conhecer os métodos HTTP que são os seguintes:

- GET: Busca dados
- POST: Cria dados
- PUT: Altera dados
- DELETE: Deleta dados

Essas são as principais, mas há mais algumas, porém essas são as mais utilizadas.

## Tipos de Parâmetros

- Query: Parâmetros nomeados enviados pela rota após "?", geralmente utilizado para filtros e ou paginação.
- Route: Identificar de recursos não nomeados.
- Request Body: É o corpo da requisição, geralmente utilizado para criar objetos ou recursos.
