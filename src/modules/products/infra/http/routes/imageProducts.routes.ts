import { Router } from 'express';
import checkRole from '@modules/users/infra/http/middlewares/checkRole';
import multer from 'multer';
import uploadConfig from '@config/upload';

import ImageProductsController from '@modules/products/infra/http/controllers/ImageProductsController';
import { celebrate, Joi, Segments } from 'celebrate';

const imageProductsRouter = Router();

const imageProductsController = new ImageProductsController();

const upload = multer(uploadConfig.multer);

imageProductsRouter.patch(
  '/:product_id',
  [checkRole(['a', 'r'])],
  upload.single('image'),
  celebrate({
    [Segments.PARAMS]: {
      product_id: Joi.string().uuid().required(),
    },
  }),
  imageProductsController.update,
);

export default imageProductsRouter;
