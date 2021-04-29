import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import ProductsInListController from '../controllers/ProductsInListController';

const productsInListController = new ProductsInListController();

const productsInListRouter = Router();

productsInListRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      page: Joi.number().min(1),
      limit: Joi.number().min(1),
      name: Joi.string(),
      type: Joi.string().required().valid('offer', 'producer'),
      date: Joi.date().default(new Date()),
    },
  }),
  productsInListController.list,
);

export default productsInListRouter;
