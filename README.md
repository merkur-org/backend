# Merkur Backend
Backend da aplicação Merkur, onde se encontra todo o controle de usuários, produtos, pedidos, pontos de entregas, ofertas semanais.

## Estrutura
Para entender um pouco a estrutura [clique aqui](https://github.com/merkur-org/backend/tree/master/docs).

## Tecnologias utilizadas
- NodeJs
- Typescript
- Jest
- Postgres
- Typeorm
- BcryptJs
- Swagger
- Nodemailer
- Docker

## Rodar projeto em modo de desenvolvimento
Para rodar o projeto em modo de desenvolvimento temos 2 opções, com docker ou diretamento com node, lembrando também que teremos que ter um banco postgres para a aplicação, as configurações de conexão ficam dentro do arquivo 'ormconfig.js'

#### Para rodar tudo com Docker
```bash
# rodar docker compose para banco e api (só com esse comando já irá fazer tudo)
docker-compose up
```

#### Para rodar banco com Docker e aplicação com node
```bash
# rodar docker compose para banco e api (só com esse comando já irá fazer tudo)
docker-compose up -d api-postgress
yarn
yarn dev
```
#### após dar start no server em modo de dev, devemos rodar as migrations
```bash
NODE_ENV=dev yarn migration

## com docker
docker exec -it api-server NODE_ENV=dev yarn typeorm migration:run
```
#### Após isso os endpoints podem ser consultados e testados no endereço http://localhost:3333/docs

## Eslint
ativar no open settings json do vs code (ctrl + shift + p)

```json
"editor.codeActionsOnSave": {
  "source.fixAll.eslint": true
}
```


## Migrations do banco
```bash
# fazer
docker exec -it api-server NODE_ENV=dev yarn typeorm migration:run

# desfazer
docker exec -it api-server NODE_ENV=dev yarn typeorm migration:revert
```

## Build do projeto
```bash
yarn build
```

## Rodar testes
```bash
yarn test --coverage
```
