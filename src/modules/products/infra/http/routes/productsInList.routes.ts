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
      image: Joi.string(),
      nutritional_information: Joi.string(),
      observation: Joi.string(),
      unit_sale: Joi.string(),
      category: Joi.string(),
      unit_buy: Joi.string(),
      fraction_buy: Joi.string(),
      fraction_sale: Joi.string(),
      cost_price: Joi.string(),
      sale_price: Joi.string(),
      wholesale_price: Joi.string(),
      organic: Joi.string(),
      highlights: Joi.string(),
      sort_by: Joi.string(),
      order: Joi.string(),
    },
  }),
  productsInListController.list,
);

export default productsInListRouter;
