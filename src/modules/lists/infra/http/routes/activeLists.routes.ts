import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import ActiveListsController from '../controllers/ActiveListsController';

const activeListsRoutes = Router();
const activeListsController = new ActiveListsController();

activeListsRoutes.get(
  '/active',
  celebrate({
    [Segments.QUERY]: {
      limit: Joi.number().min(1),
      page: Joi.number().min(1),
      date: Joi.date(),
      type: Joi.string().required().valid('offer', 'producer'),
    },
  }),
  activeListsController.list,
);

export default activeListsRoutes;
