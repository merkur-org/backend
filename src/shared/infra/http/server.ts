import 'reflect-metadata';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import 'express-async-errors';
import morgan from 'morgan';
import morganBody from 'morgan-body';

import AppError from '@shared/errors/AppError';

import logger from '@shared/utils/logger';
import config from '@config/index';
import expressDevLogger from '@shared/utils/expressDevLogger';
import routes from './routes';

import '@shared/infra/typeorm/index';
import '@shared/container/index';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

if (config.morganLogger) {
  app.use(
    morgan(':method :url :status :response-time ms - :res[content-length]'),
  );
}

if (config.morganBodyLogger) {
  morganBody(app);
}

if (config.expressDevLogger) {
  app.use(expressDevLogger);
}

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  logger.error(err);

  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

const { port } = config;

app.listen(port, () => {
  logger.info(`Server started on port ${port}!`);
});
