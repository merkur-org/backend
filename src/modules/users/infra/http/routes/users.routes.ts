import { Router } from 'express';

import UsersController from '../controllers/UsersController';

const usersRouter = Router();
const usersController = new UsersController();

usersRouter.post('/', usersController.create);
usersRouter.get('/:user_id', usersController.show);
usersRouter.put('/:user_id', usersController.update);
usersRouter.delete('/:user_id', usersController.delete);

export default usersRouter;
