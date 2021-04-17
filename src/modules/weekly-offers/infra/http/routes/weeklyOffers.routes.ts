import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import checkRole from '@modules/users/infra/http/middlewares/checkRole';
import WeeklyOffersController from '../controllers/WeeklyOffersController';

const weeklyOffersRoutes = Router();
const weeklyOffersController = new WeeklyOffersController();

weeklyOffersRoutes.use(ensureAuthenticated);

weeklyOffersRoutes.post(
  '/',
  [checkRole(['r', 'a'])],
  celebrate({
    [Segments.BODY]: {
      end_date: Joi.date(),
      start_date: Joi.date(),
      status: Joi.string().required(),
      details: Joi.array().items({
        product_id: Joi.string().required(),
        quantity: Joi.number().required(),
        unit_price: Joi.number().required(),
        sale_price: Joi.number().required(),
      }),
    },
  }),
  weeklyOffersController.create,
);

weeklyOffersRoutes.get(
  '/:offer_id',
  [checkRole(['r', 'a'])],
  celebrate({
    [Segments.PARAMS]: {
      offer_id: Joi.string().required(),
    },
  }),
  weeklyOffersController.show,
);

weeklyOffersRoutes.get(
  '/',
  [checkRole(['r', 'a'])],
  celebrate({
    [Segments.QUERY]: {
      limit: Joi.number().min(1),
      page: Joi.number().min(1),
    },
  }),
  weeklyOffersController.list,
);

weeklyOffersRoutes.delete(
  '/:offer_id',
  [checkRole(['r', 'a'])],
  celebrate({
    [Segments.PARAMS]: {
      offer_id: Joi.string().required(),
    },
  }),
  weeklyOffersController.delete,
);

weeklyOffersRoutes.put(
  '/:offer_id',
  [checkRole(['r', 'a'])],
  celebrate({
    [Segments.PARAMS]: {
      offer_id: Joi.string().required(),
    },
    [Segments.BODY]: {
      end_date: Joi.date(),
      start_date: Joi.date(),
      status: Joi.string().required(),
      details: Joi.array().items({
        product_id: Joi.string().required(),
        quantity: Joi.number().required(),
        unit_price: Joi.number().required(),
        sale_price: Joi.number().required(),
      }),
    },
  }),
  weeklyOffersController.update,
);

export default weeklyOffersRoutes;
