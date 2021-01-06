import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProductsController from '../controllers/ProductsController';

const productsController = new ProductsController();

const productsRouter = Router();

productsRouter.use(ensureAuthenticated);

productsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      cost_price: Joi.number().required(),
      sale_price: Joi.number().required(),
      unit: Joi.string().valid('kg', 'g', 'l', 'ml', 'un', 'ton').required(),
      wholesale_price: Joi.number(),
    },
  }),
  productsController.create,
);

export default productsRouter;
