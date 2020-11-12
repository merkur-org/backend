```bash
# build da imagem
docker build -t api-extensao -f Dockerfile.dev .

# rodar imagem docker da API
docker run -p 3333:3333 ${PWD}:/home/node/api -v /home/bot/node_modules api-extensao

# rodar docker compose para banco e api (só com esse comando já irá fazer tudo)
docker-compose up
```

ativar no open settings json do vs code (ctrl + shift + p)

```json
"editor.codeActionsOnSave": {
  "source.fixAll.eslint": true
}
```
