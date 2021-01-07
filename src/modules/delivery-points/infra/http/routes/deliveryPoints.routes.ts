import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import DeliveryPointsController from '../controllers/DeliveryPointsController';

const deliveryPointsRoutes = Router();
const deliveryPointsController = new DeliveryPointsController();

deliveryPointsRoutes.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      state: Joi.string().required(),
      limit: Joi.number().min(1),
      page: Joi.number().min(1),
    },
  }),
  deliveryPointsController.list,
);

deliveryPointsRoutes.get(
  '/:point_id',
  celebrate({
    [Segments.PARAMS]: {
      point_id: Joi.string().uuid().required(),
    },
  }),
  deliveryPointsController.show,
);

deliveryPointsRoutes.use(ensureAuthenticated);

deliveryPointsRoutes.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      city: Joi.string().required(),
      state: Joi.string().required(),
      suburb: Joi.string().required(),
      street: Joi.string().required(),
      cep: Joi.number().required(),
      number: Joi.number().required(),
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
    },
  }),
  deliveryPointsController.create,
);

deliveryPointsRoutes.put(
  '/:point_id',
  celebrate({
    [Segments.PARAMS]: {
      point_id: Joi.string().uuid().required(),
    },
  }),
  deliveryPointsController.update,
);

deliveryPointsRoutes.delete(
  '/:point_id',
  celebrate({
    [Segments.PARAMS]: {
      point_id: Joi.string().uuid().required(),
    },
  }),
  deliveryPointsController.delete,
);

export default deliveryPointsRoutes;
