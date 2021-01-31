import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';

import SessionsController from '../controllers/SessionsController';

const sessionsRouter = Router();
const sessionsController = new SessionsController();

/**
 * @swagger
 * /sessions:
 *  post:
 *    description: creates a new section for the user, returning a jwt token for authentication
 *    tags:
 *      - users
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *           type: object
 *           properties:
 *            name:
 *              type: string
 *            email:
 *              type: string
 *    responses:
 *      '200':
 *        description: session created successfully
 */
sessionsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email(),
      phone: Joi.string().regex(
        /^\([1-9]{2}\) (?:[2-8]|9[1-9])[0-9]{3}-[0-9]{4}$/,
      ),
      password: Joi.string(),
      cpf: Joi.string(),
    },
  }),
  sessionsController.create,
);

export default sessionsRouter;
