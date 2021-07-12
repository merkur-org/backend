import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import checkRole from '@modules/users/infra/http/middlewares/checkRole';
import OrdersController from '../controllers/OrdersController';

const ordersRoutes = Router();
const ordersController = new OrdersController();

ordersRoutes.use(ensureAuthenticated);

ordersRoutes.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      date: Joi.date(),
      delivery_point_id: Joi.string().uuid().required(),
      list_id: Joi.string().uuid().required(),
      final_value: Joi.number().required(),
      payment_status: Joi.string().valid(
        'processing',
        'awaiting_payment',
        'canceled',
        'expired',
        'paid',
      ),
      payment_type: Joi.string().valid(
        'credit_card',
        'money',
        'pix',
        'bank_slip',
        'bank_transfer',
      ),
      sales_type: Joi.string().valid('wholesale', 'retail'),
      value: Joi.number().required(),
      details: Joi.array().items({
        product_id: Joi.string().uuid().required(),
        quantity: Joi.number().required(),
        discount: Joi.number().required(),
      }),
    },
  }),
  ordersController.create,
);

ordersRoutes.put(
  '/:order_id',
  [checkRole(['r'])],
  celebrate({
    [Segments.PARAMS]: {
      order_id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      date: Joi.date(),
      delivery_point_id: Joi.string().uuid(),
      list_id: Joi.string().uuid(),
      final_value: Joi.number(),
      payment_status: Joi.string().valid(
        'processing',
        'awaiting_payment',
        'canceled',
        'expired',
        'paid',
      ),
      payment_type: Joi.string().valid(
        'credit_card',
        'money',
        'pix',
        'bank_slip',
        'bank_transfer',
      ),
      sales_type: Joi.string().valid('wholesale', 'retail'),
      value: Joi.number(),
      details: Joi.array().items({
        id: Joi.string().uuid().required(),
        product_id: Joi.string().uuid(),
        unit_price: Joi.number(),
        quantity: Joi.number(),
        discount: Joi.number(),
      }),
    },
  }),
  ordersController.update,
);
ordersRoutes.delete(
  '/:order_id',
  celebrate({
    [Segments.PARAMS]: {
      order_id: Joi.string().uuid().required(),
    },
  }),
  [checkRole(['r'])],
  ordersController.delete,
);
ordersRoutes.get(
  '/:user_id/:order_id',
  celebrate({
    [Segments.PARAMS]: {
      order_id: Joi.string().uuid().required(),
      user_id: Joi.string().uuid().required(),
    },
  }),
  [checkRole(['r', 'himself'])],
  ordersController.show,
);

ordersRoutes.get(
  '/',
  [checkRole(['r'])],
  celebrate({
    [Segments.QUERY]: {
      limit: Joi.number().min(1),
      page: Joi.number().min(1),
      sort_by: Joi.string(),
      order: Joi.string(),
      payment_type: Joi.string(),
      payment_status: Joi.string(),
      sales_type: Joi.string(),
      delivery_point_id: Joi.string(),
      user_id: Joi.string(),
      date: Joi.string(),
    },
  }),
  ordersController.list,
);

export default ordersRoutes;
