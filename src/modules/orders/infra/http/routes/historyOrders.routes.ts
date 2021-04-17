import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import HistoryOrdersController from '../controllers/HistoryOrdersController';

const ordersRoutes = Router();
const historyOrdersController = new HistoryOrdersController();

ordersRoutes.use(ensureAuthenticated);

ordersRoutes.get(
  '/me',
  celebrate({
    [Segments.QUERY]: {
      page: Joi.number().min(1),
      limit: Joi.number().min(1),
    },
  }),
  historyOrdersController.list,
);

export default ordersRoutes;
