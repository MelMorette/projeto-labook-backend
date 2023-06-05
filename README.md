# 🍕🍔 Projeto Labook Backend

O Labook-backend é um projeto de backend que visa fornecer uma API para gerenciar menus de comidas. Ele foi desenvolvido utilizando Node.js e TypeScript, juntamente com o framework Express. A API utiliza um banco de dados SQL, especificamente SQLite, e o acesso a ele é feito através da biblioteca Knex.

O projeto segue uma arquitetura em camadas, o que proporciona uma separação clara de responsabilidades e facilita a manutenção e escalabilidade do sistema. Além disso, são utilizados conceitos de Programação Orientada a Objetos (POO) para organizar o código.

A autenticação e autorização são parte fundamental da API. A identificação dos usuários é feita utilizando UUID (Universally Unique Identifier), garantindo que cada usuário tenha um identificador único. As senhas dos usuários são armazenadas de forma segura com a técnica de hash utilizando Bcrypt. Para a autenticação dos usuários, é utilizado um sistema de tokens JWT (JSON Web Token), que são emitidos no momento do login e devem ser incluídos nas requisições protegidas para garantir o acesso adequado aos endpoints.

O projeto inclui também a definição de roles de usuário, sendo possível atribuir aos usuários a role de "NORMAL" ou "ADMIN". O payload do token JWT contém informações como o id do usuário, o nome e a role.

# Conteúdos abordados
- NodeJS
- Typescript
- Express
- SQL e SQLite
- Knex
- POO
- Arquitetura em camadas
- Geração de UUID
- Geração de hashes
- Autenticação e autorização
- Roteamento
- Postman

# Banco de dados
![Diagrama do Banco de Dados](https://i.imgur.com/u5Rt8ch.png)

# Token payload e User roles
O enum de roles e o payload do token JWT devem estar no seguinte formato:
```typescript
export enum USER_ROLES {
    NORMAL = "NORMAL",
    ADMIN = "ADMIN"
}

export interface TokenPayload {
    id: string,
    name: string,
    role: USER_ROLES
}
```

# Exemplos de requisição

## Signup
Endpoint público utilizado para cadastro. Devolve um token jwt.
```typescript
// request POST /users/signup
// body JSON
{
  "name": "Elon Musk",
  "email": "elonmusk@email.com",
  "password": "ilovetesla"
}

// response
// status 201 CREATED
{
  token: "um token jwt"
}
```

## Login
Endpoint público utilizado para login. Devolve um token jwt.
```typescript
// request POST /users/login
// body JSON
{
  "email": "elonmusk@email.com",
  "password": "ilovetesla"
}

// response
// status 200 OK
{
  token: "um token jwt"
}
```

## Get menus
Endpoint protegido, requer um token jwt para acessá-lo.
```typescript
// request GET /menus
// headers.authorization = "token jwt"

// response
// status 200 OK
[
    {
        "id": "uma uuid v4",
        "name": "Pizzas",
        "likes": 2,
        "dislikes": 1,
        "createdAt": "2023-01-20T12:11:47:000Z"
        "updatedAt": "2023-01-20T12:11:47:000Z"
        "creator": {
            "id": "uma uuid v4",
            "name": "Fulano"
        }
    },
    {
        "id": "uma uuid v4",
        "name": "Hamburguers",
        "likes": 0,
        "dislikes": 0,
        "createdAt": "2023-01-20T15:41:12:000Z"
        "updatedAt": "2023-01-20T15:49:55:000Z"
        "creator": {
            "id": "uma uuid v4",
            "name": "Ciclana"
        }
    }
]
```

## Create menu
Endpoint protegido, requer um token jwt para acessá-lo.
```typescript
// request POST /menus
// headers.authorization = "token jwt"
// body JSON
{
    "name": "Sorvetes"
}

// response
// status 201 CREATED
```

## Edit menu
Endpoint protegido, requer um token jwt para acessá-lo.<br>
Só quem criou a menu pode editá-lo e somente o nome pode ser editado.
```typescript
// request PUT /menus/:id
// headers.authorization = "token jwt"
// body JSON
{
    "name": "Pizzas Doces"
}

// response
// status 200 OK
```

## Delete menu
Endpoint protegido, requer um token jwt para acessá-lo.<br>
Só quem criou a menu pode deletá-lo. Admins podem deletar a menu de qualquer pessoa.

```typescript
// request DELETE /menus/:id
// headers.authorization = "token jwt"

// response
// status 200 OK
```

## Like or dislike menu (mesmo endpoint faz as duas coisas)

Endpoint protegido, requer um token jwt para acessá-lo.<br>
Quem criou a menu não pode dar like ou dislike na mesma.<br><br>
Caso dê um like em uma menu que já tenha dado like, o like é desfeito.<br>
Caso dê um dislike em uma menu que já tenha dado dislike, o dislike é desfeito.<br><br>
Caso dê um like em uma menu que tenha dado dislike, o like sobrescreve o dislike.<br>
Caso dê um dislike em uma menu que tenha dado like, o dislike sobrescreve o like.

### Like (funcionalidade 1)
```typescript
// request PUT /menus/:id/like
// headers.authorization = "token jwt"
// body JSON
{
    "like": true
}

// response
// status 200 OK
```

### Dislike (funcionalidade 2)
```typescript
// request PUT /menus/:id/like
// headers.authorization = "token jwt"
// body JSON
{
    "like": false
}

// response
// status 200 OK
```

### Para entender a tabela likes_dislikes
- no SQLite, lógicas booleanas devem ser controladas via 0 e 1 (INTEGER)
- quando like valer 1 na tabela é porque a pessoa deu like na menu
    - na requisição like é true
    
- quando like valer 0 na tabela é porque a pessoa deu dislike na menu
    - na requisição like é false
    
- caso não exista um registro na tabela de relação, é porque a pessoa não deu like nem dislike
- caso dê like em uma menu que já tenha dado like, o like é removido (deleta o item da tabela)
- caso dê dislike em uma menu que já tenha dado dislike, o dislike é removido (deleta o item da tabela)

# Documentação Postman
https://documenter.getpostman.com/view/27061449/2s93sXbtzn
