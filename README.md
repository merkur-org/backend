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
## Docker
```bash
# rodar docker compose para banco e api (só com esse comando já irá fazer tudo)
docker-compose up
```

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
