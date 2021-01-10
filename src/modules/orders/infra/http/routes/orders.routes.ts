import { Router } from 'express';
// import { celebrate, Joi, Segments } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import OrdersController from '../controllers/OrdersController';

const ordersRoutes = Router();
const ordersController = new OrdersController();

ordersRoutes.use(ensureAuthenticated);

ordersRoutes.post(
  '/',
  // celebrate({
  //   [Segments.BODY]: {
  //     point: Joi.array().required(),
  //   },
  // }),
  ordersController.create,
);

export default ordersRoutes;
