import dotenvExtended from 'dotenv-extended';
import dotenvParseVariables from 'dotenv-parse-variables';
import { SwaggerDefinition } from 'swagger-jsdoc';

const swaggerDefinition = {
  info: {
    title: 'API REST project for family farming cooperatives',
    description:
      'the entire sales and distribution flow of small cooperatives, as well as cash control and chart of accounts',
    version: '1.0.0',
  },
  servers: ['http://localhost:3000'],
} as SwaggerDefinition;

export const swaggerOptions = {
  swaggerDefinition,
  apis: ['src/modules/**/infra/http/routes/*routes.ts'],
};

const env = dotenvExtended.load({
  path: process.env.ENV_FILE,
  defaults: './env/.env.defaults',
  schema: './env/.env.schema',
  includeProcessEnv: true,
  silent: false,
  errorOnMissing: true,
  errorOnExtra: true,
});

const parsedEnv = dotenvParseVariables(env);

// Define log levels type (silent + Winston default npm)
type LogLevel =
  | 'silent'
  | 'error'
  | 'warn'
  | 'info'
  | 'http'
  | 'verbose'
  | 'debug'
  | 'silly';

interface Config {
  morganLogger: boolean;
  morganBodyLogger: boolean;
  expressDevLogger: boolean;
  loggerLevel: LogLevel;
  port: number;

  jwt: {
    secret: string;
    expiresIn: string;
  };
}

const config: Config = {
  morganLogger: parsedEnv.MORGAN_LOGGER as boolean,
  morganBodyLogger: parsedEnv.MORGAN_BODY_LOGGER as boolean,
  expressDevLogger: parsedEnv.EXPRESS_DEV_LOGGER as boolean,
  loggerLevel: parsedEnv.LOGGER_LEVEL as LogLevel,

  port: parsedEnv.PORT as number,

  jwt: {
    secret: parsedEnv.JWT_SECRET as string,
    expiresIn: parsedEnv.JWT_EXPIRES_IN as string,
  },
};

export default config;
