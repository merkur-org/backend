import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import checkRole from '@modules/users/infra/http/middlewares/checkRole';
import WeeklyListController from '../controllers/WeeklyListController';

const weeklyListRoutes = Router();
const weeklyListController = new WeeklyListController();

weeklyListRoutes.use(ensureAuthenticated);

weeklyListRoutes.post(
  '/',
  [checkRole(['r'])],
  celebrate({
    [Segments.BODY]: {
      start_date: Joi.date(),
      status: Joi.string().required(),
      details: Joi.array().items({
        product_id: Joi.string().required(),
        due_date: Joi.date().required(),
        quantity: Joi.number().required(),
        unit_price: Joi.number().required(),
        discount: Joi.number(),
        total_price: Joi.number().required(),
        lot: Joi.string(),
      }),
    },
  }),
  weeklyListController.create,
);

weeklyListRoutes.get(
  '/:list_id',
  [checkRole(['r'])],
  celebrate({
    [Segments.PARAMS]: {
      list_id: Joi.string().required(),
    },
  }),
  weeklyListController.show,
);

weeklyListRoutes.get(
  '/',
  [checkRole(['r'])],
  celebrate({
    [Segments.QUERY]: {
      limit: Joi.number().min(1),
      page: Joi.number().min(1),
      user_id: Joi.string().required(),
    },
  }),
  weeklyListController.list,
);

weeklyListRoutes.delete(
  '/:list_id',
  [checkRole(['r'])],
  celebrate({
    [Segments.PARAMS]: {
      list_id: Joi.string().required(),
    },
  }),
  weeklyListController.delete,
);

weeklyListRoutes.put(
  '/:list_id',
  [checkRole(['r'])],
  celebrate({
    [Segments.PARAMS]: {
      list_id: Joi.string().required(),
    },
    [Segments.BODY]: {
      start_date: Joi.date(),
      status: Joi.string().required(),
      details: Joi.array().items({
        id: Joi.string().required(),
        due_date: Joi.date().required(),
        quantity: Joi.number().required(),
        unit_price: Joi.number().required(),
        discount: Joi.number(),
        total_price: Joi.number().required(),
        lot: Joi.string(),
      }),
    },
  }),
  weeklyListController.update,
);

export default weeklyListRoutes;
