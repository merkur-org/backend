## Docker
```bash
# build da imagem
docker build -t api-extensao -f Dockerfile.dev .

# rodar imagem docker da API
docker run -p 3333:3333 ${PWD}:/home/node/api -v /home/node/api/node_modules api-extensao

# rodar docker compose para banco e api (só com esse comando já irá fazer tudo)
docker-compose up
```

ativar no open settings json do vs code (ctrl + shift + p)

```json
"editor.codeActionsOnSave": {
  "source.fixAll.eslint": true
}
```


## Migrations do banco

```bash
# fazer
docker exec -it api-server yarn typeorm migration:run

# desfazer
docker exec -it api-server yarn typeorm migration:revert
```

## Build do projeto
```bash
yarn build
```


## Após fazer o build do projeto deve se trocar no ormconfig.json

```json
 ## pasta src para dist e a extensão para js
 "migrations": [
    "./src/shared/infra/typeorm/migrations/*.ts"
  ],
  "cli": {
    "migrationsDir": "./src/shared/infra/typeorm/migrations"
  }

## como ficaria
  "migrations": [
    "./dist/shared/infra/typeorm/migrations/*.js"
  ],
  "cli": {
    "migrationsDir": "./dist/shared/infra/typeorm/migrations"
  }
```
// TODO [X] permissão no payload do token
// TODO [X] email pode ser null ? aquela senhora que compra e faria login pelo celular
// TODO [X] login pelo phone e cpf
// TODO [ ] usuário admin será criado no banco com as migrations, criar um populate
// TODO [X] Tratar phone para guardar (46) 99903-9412 como 46999039412
// TODO [X] adicionar role de root ou admin
// TODO [X] criar user com role 'r' só um role 'r' pode
