import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import checkRole from '@modules/users/infra/http/middlewares/checkRole';
import ListsController from '../controllers/ListsController';

const listsRoutes = Router();
const listsController = new ListsController();

listsRoutes.use(ensureAuthenticated);

listsRoutes.post(
  '/',
  [checkRole(['r'])],
  celebrate({
    [Segments.BODY]: {
      start_date: Joi.date(),
      end_date: Joi.date(),
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
  listsController.create,
);

listsRoutes.get(
  '/:list_id',
  [checkRole(['r'])],
  celebrate({
    [Segments.PARAMS]: {
      list_id: Joi.string().required(),
    },
  }),
  listsController.show,
);

listsRoutes.get(
  '/',
  [checkRole(['r'])],
  celebrate({
    [Segments.QUERY]: {
      limit: Joi.number().min(1),
      page: Joi.number().min(1),
      user_id: Joi.string(),
    },
  }),
  listsController.list,
);

listsRoutes.delete(
  '/:list_id',
  [checkRole(['r'])],
  celebrate({
    [Segments.PARAMS]: {
      list_id: Joi.string().required(),
    },
  }),
  listsController.delete,
);

listsRoutes.put(
  '/:list_id',
  [checkRole(['r'])],
  celebrate({
    [Segments.PARAMS]: {
      list_id: Joi.string().required(),
    },
    [Segments.BODY]: {
      start_date: Joi.date(),
      end_date: Joi.date(),
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
  listsController.update,
);

export default listsRoutes;
