import 'reflect-metadata';

import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import morgan from 'morgan';
import morganBody from 'morgan-body';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { errors } from 'celebrate';

import logger from '@shared/utils/logger';
import config from '@config/index';
import expressDevLogger from '@shared/utils/expressDevLogger';
import uploadConfig from '@config/upload';
import routes from './routes';

import '@shared/infra/typeorm/index';
import '@shared/container/index';
import exceptionHandler from './middlewares/exceptionHandler';

const swaggerDocument = YAML.load('./docs/swagger.yaml');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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

app.use(routes);
app.use('/files', express.static(uploadConfig.uploadsFolder));

app.use(errors({ statusCode: 403 }));

app.use(exceptionHandler);

const { port } = config;

app.listen(port, () => {
  logger.info(`Server started on port ${port}!`);
  logger.info(`docs in http://localhost:${port}/docs`);
});
