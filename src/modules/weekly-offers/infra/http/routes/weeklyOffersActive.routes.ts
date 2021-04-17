import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import WeeklyOffersActiveController from '../controllers/WeeklyOffersActiveController';

const weeklyOffersActiveRoutes = Router();
const weeklyOffersActiveController = new WeeklyOffersActiveController();

weeklyOffersActiveRoutes.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      limit: Joi.number().min(1),
      page: Joi.number().min(1),
      date: Joi.date(),
    },
  }),
  weeklyOffersActiveController.list,
);

export default weeklyOffersActiveRoutes;
