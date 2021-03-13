import dotenvExtended from 'dotenv-extended';
import dotenvParseVariables from 'dotenv-parse-variables';

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

type IMailDriver = 'ethereal' | 'ses';

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

  mailDriver: IMailDriver;

  mailDefaults: {
    from: {
      email: string;
      name: string;
    };
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

  mailDriver: (parsedEnv.MAIL_DRIVER || 'ethereal') as IMailDriver,

  mailDefaults: {
    from: {
      email: 'cooperativa@dominio.com.br',
      name: 'Cooperativa felicidade',
    },
  },
};

export default config;
