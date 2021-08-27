import { Router } from 'express';

import usersRoutes from '@modules/users/infra/http/routes/users.routes';
import sessionsRoutes from '@modules/users/infra/http/routes/sessions.routes';
import productsRoutes from '@modules/products/infra/http/routes/products.routes';
import productsInList from '@modules/products/infra/http/routes/productsInList.routes';
import imageProducts from '@modules/products/infra/http/routes/imageProducts.routes';
import deliveryPointsRoutes from '@modules/delivery-points/infra/http/routes/deliveryPoints.routes';
import ordersRoutes from '@modules/orders/infra/http/routes/orders.routes';
import listsRoutes from '@modules/lists/infra/http/routes/lists.routes';
import historyOrders from '@modules/orders/infra/http/routes/historyOrders.routes';
import passwordRoutes from '@modules/users/infra/http/routes/password.routes';

const routes = Router();

routes.use('/users', usersRoutes);
routes.use('/sessions', sessionsRoutes);
routes.use('/password', passwordRoutes);

routes.use('/delivery-points', deliveryPointsRoutes);

routes.use('/products/in-list', productsInList);
routes.use('/products', productsRoutes);
routes.use('/products/image', imageProducts);

routes.use('/lists', listsRoutes);

routes.use('/orders', ordersRoutes);
routes.use('/orders', historyOrders);

export default routes;
