import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import checkRole from '../middlewares/checkRole';

import UsersController from '../controllers/UsersController';

const usersRouter = Router();
const usersController = new UsersController();

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email(),
      phone: Joi.string()
        .required()
        .regex(/^\([1-9]{2}\) (?:[2-8]|9[1-9])[0-9]{3}-[0-9]{4}$/),
      password: Joi.string(),
      cpf: Joi.string(),
      cnpj: Joi.string(),
      role: Joi.string().valid('r', 'b', 'p', 'd', 'a', 'f', 'bp', 'db', 'bf'),
    },
  }),
  usersController.create,
);

usersRouter.use(ensureAuthenticated);

usersRouter.get(
  '/:user_id',
  [checkRole(['r', 'himself'])],
  celebrate({
    [Segments.PARAMS]: {
      user_id: Joi.string().uuid().required(),
    },
  }),
  usersController.show,
);

usersRouter.get(
  '/',
  [checkRole(['r'])],
  celebrate({
    [Segments.QUERY]: {
      limit: Joi.number().min(1),
      page: Joi.number().min(1),
      sort_by: Joi.string(),
      name: Joi.string(),
      email: Joi.string(),
      order: Joi.string(),
      role: Joi.string().valid('r', 'b', 'p', 'd', 'a', 'f', 'bp', 'db', 'bf'),
    },
  }),
  usersController.list,
);

usersRouter.put(
  '/:user_id',
  [checkRole(['r', 'himself'])],
  celebrate({
    [Segments.PARAMS]: {
      user_id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      name: Joi.string(),
      email: Joi.string().email(),
      phone: Joi.string().regex(
        /^\([1-9]{2}\) (?:[2-8]|9[1-9])[0-9]{3}-[0-9]{4}$/,
      ),
      cpf: Joi.string(),
      cnpj: Joi.string(),
      old_password: Joi.string(),
      password: Joi.string(),
      password_confirmation: Joi.string().valid(Joi.ref('password')),
      role: Joi.string().valid('r', 'b', 'p', 'd', 'a', 'f', 'bp', 'db', 'bf'),
    },
  }),
  usersController.update,
);

usersRouter.delete(
  '/:user_id',
  [checkRole(['r', 'himself'])],
  celebrate({
    [Segments.PARAMS]: {
      user_id: Joi.string().uuid().required(),
    },
  }),
  usersController.delete,
);

export default usersRouter;
