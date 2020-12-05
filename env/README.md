## Pasta variáveis ambiente

Nesta pasta teremos um arquivo para cada ambiente que nossa aplicação irá rodar. Em cada arquivo iremos definir a variável de acordo com o ambiente

Ex: variável que representa a porta que a aplicação irá rodar

em desenvolvimento podemos rodar na porta 3333, iremos definir no arquivo .env.dev PORT=3333, e se quisermos rodar a aplicação em produção na porta 10032, definimos no arquivo .env.prod PORT=10032.

Nos scripts do arquivo package.json informamos qual arquivo iremos utilizar para rodar a aplicação

```json
"dev": "ENV_FILE=./config/.env.dev ts-node-dev server.ts"
```

