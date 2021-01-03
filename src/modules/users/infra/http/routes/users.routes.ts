import { Router } from 'express';

import UsersController from '../controllers/UsersController';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();
const usersController = new UsersController();

usersRouter.post('/', usersController.create);

usersRouter.use(ensureAuthenticated);

usersRouter.get('/:user_id', usersController.show);
usersRouter.get('/', usersController.list);
usersRouter.put('/:user_id', usersController.update);
usersRouter.delete('/:user_id', usersController.delete);

export default usersRouter;
