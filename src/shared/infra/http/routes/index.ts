import { Router } from 'express';

import usersRoutes from '@modules/users/infra/http/routes/users.routes';
import sessionsRoutes from '@modules/users/infra/http/routes/sessions.routes';
import productsRoutes from '@modules/products/infra/http/routes/products.routes';
import deliveryPointsRoutes from '@modules/delivery-points/infra/http/routes/deliveryPoints.routes';
import weeklyListRoutes from '@modules/weekly-list/infra/http/routes/weeklyList.routes';
import ordersRoutes from '@modules/orders/infra/http/routes/orders.routes';
import passwordRoutes from '@modules/users/infra/http/routes/password.routes';

const routes = Router();

routes.use('/users', usersRoutes);
routes.use('/sessions', sessionsRoutes);
routes.use('/password', passwordRoutes);

routes.use('/delivery-points', deliveryPointsRoutes);

routes.use('/products', productsRoutes);

routes.use('/weekly-list', weeklyListRoutes);

routes.use('/orders', ordersRoutes);

export default routes;
