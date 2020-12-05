## Configurações

No arquivo index.js estaremos lendo o arquivo default de variáveis e o arquivo de variáveis ambiente informado na hora da execução do server, após isso estaremos disponibilizando as variáveis para a aplicação.

Toda nova variável ambiente deve ser adicionado na interface seu nome e tipo, e posteriormente declarado no objeto de config

Ex: se quisermos adicionar uma variável que represente o HOST do banco

```typescript
// inicialmente
interface Config {
  morganLogger: boolean;
  morganBodyLogger: boolean;
  expressDevLogger: boolean;
  loggerLevel: LogLevel;
  port: number;
}

const config: Config = {
  morganLogger: parsedEnv.MORGAN_LOGGER as boolean,
  morganBodyLogger: parsedEnv.MORGAN_BODY_LOGGER as boolean,
  expressDevLogger: parsedEnv.EXPRESS_DEV_LOGGER as boolean,
  loggerLevel: parsedEnv.LOGGER_LEVEL as LogLevel,

  port: parsedEnv.PORT as number,
};


// para adicionar

interface Config {
  morganLogger: boolean;
  morganBodyLogger: boolean;
  expressDevLogger: boolean;
  loggerLevel: LogLevel;
  port: number;
  dbHost: string;
}

const config: Config = {
  morganLogger: parsedEnv.MORGAN_LOGGER as boolean,
  morganBodyLogger: parsedEnv.MORGAN_BODY_LOGGER as boolean,
  expressDevLogger: parsedEnv.EXPRESS_DEV_LOGGER as boolean,
  loggerLevel: parsedEnv.LOGGER_LEVEL as LogLevel,

  port: parsedEnv.PORT as number,
  port: parsedEnv.DB_HOST as string, // Note que a variável DB_HOST deve ser adicionada nos arquivos .env da pasta env na raiz
};
```

