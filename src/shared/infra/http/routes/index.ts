import { Router } from 'express';

import usersRoutes from '@modules/users/infra/http/routes/users.routes';
import sessionsRoutes from '@modules/users/infra/http/routes/sessions.routes';
import productsRoutes from '@modules/products/infra/http/routes/products.routes';
import deliveryPointsRoutes from '@modules/delivery-points/infra/http/routes/deliveryPoints.routes';

const routes = Router();

routes.use('/users', usersRoutes);
routes.use('/sessions', sessionsRoutes);

routes.use('/delivery-points', deliveryPointsRoutes);

routes.use('/products', productsRoutes);

export default routes;
