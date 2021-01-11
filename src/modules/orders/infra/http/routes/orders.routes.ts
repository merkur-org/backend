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
      date: Joi.date().required(),
      delivery_point_id: Joi.string().uuid().required(),
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
        unit_price: Joi.number().required(),
        quantity: Joi.number().required(),
        discount: Joi.number().required(),
      }),
    },
  }),
  ordersController.create,
);

ordersRoutes.put('/:order_id', [checkRole(['r'])], ordersController.update);

export default ordersRoutes;
