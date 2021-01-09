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
      point: Joi.array().required(),
    },
  }),
  weeklyListController.create,
);

export default weeklyListRoutes;
