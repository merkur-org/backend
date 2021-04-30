import { Router } from 'express';
import multer from 'multer';
import { celebrate, Joi, Segments } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import checkRole from '@modules/users/infra/http/middlewares/checkRole';
import uploadConfig from '@config/upload';
import ProductsController from '../controllers/ProductsController';

const productsController = new ProductsController();

const upload = multer(uploadConfig.multer);

const productsRouter = Router();

productsRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      page: Joi.number().min(1),
      limit: Joi.number().min(1),
      name: Joi.string(),
    },
  }),
  productsController.list,
);

productsRouter.get(
  '/:product_id',
  celebrate({
    [Segments.PARAMS]: {
      product_id: Joi.string().uuid().required(),
    },
  }),
  productsController.show,
);

productsRouter.use(ensureAuthenticated);

productsRouter.post(
  '/',
  [checkRole(['r', 'a'])],
  upload.single('image'),
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      cost_price: Joi.number().required(),
      sale_price: Joi.number().required(),
      category: Joi.string()
        .valid('Verduras', 'Legumes', 'Proteínas', 'Bebidas', 'Carboidratos')
        .required(),
      unit_buy: Joi.string()
        .valid('kg', 'g', 'l', 'ml', 'un', 'ton', 'box', 'bag')
        .required(),
      unit_sale: Joi.string()
        .valid('kg', 'g', 'l', 'ml', 'un', 'ton', 'box', 'bag')
        .required(),
      fraction_buy: Joi.number().required(),
      fraction_sale: Joi.number().required(),
      wholesale_price: Joi.number(),
      observation: Joi.string(),
      organic: Joi.boolean().default(true),
      highlights: Joi.boolean().default(false),
      nutritional_information: Joi.string(),
    },
  }),
  productsController.create,
);

productsRouter.put(
  '/:product_id',
  [checkRole(['r', 'a'])],
  celebrate({
    [Segments.PARAMS]: {
      product_id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      name: Joi.string(),
      cost_price: Joi.number(),
      sale_price: Joi.number(),
      unit_buy: Joi.string().valid(
        'kg',
        'g',
        'l',
        'ml',
        'un',
        'ton',
        'box',
        'bag',
      ),

      unit_sale: Joi.string().valid(
        'kg',
        'g',
        'l',
        'ml',
        'un',
        'ton',
        'box',
        'bag',
      ),
      category: Joi.string().valid(
        'Verduras',
        'Legumes',
        'Proteínas',
        'Bebidas',
        'Carboidratos',
      ),
      fraction_buy: Joi.number(),
      fraction_sale: Joi.number(),
      wholesale_price: Joi.number(),
      observation: Joi.string(),
      observatnutritional_informationion: Joi.string(),
    },
  }),
  productsController.update,
);

productsRouter.delete(
  '/:product_id',
  [checkRole(['r', 'a'])],
  celebrate({
    [Segments.PARAMS]: {
      product_id: Joi.string().uuid().required(),
    },
  }),
  productsController.delete,
);

export default productsRouter;
