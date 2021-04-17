import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import WeeklyListsActiveController from '../controllers/WeeklyListsActiveController';

const weeklyListsActiveRoutes = Router();
const weeklyListsActiveController = new WeeklyListsActiveController();

weeklyListsActiveRoutes.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      limit: Joi.number().min(1),
      page: Joi.number().min(1),
      date: Joi.date(),
    },
  }),
  weeklyListsActiveController.list,
);

export default weeklyListsActiveRoutes;
