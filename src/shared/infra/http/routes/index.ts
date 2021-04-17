import { Router } from 'express';

import usersRoutes from '@modules/users/infra/http/routes/users.routes';
import sessionsRoutes from '@modules/users/infra/http/routes/sessions.routes';
import productsRoutes from '@modules/products/infra/http/routes/products.routes';
import deliveryPointsRoutes from '@modules/delivery-points/infra/http/routes/deliveryPoints.routes';
import weeklyListRoutes from '@modules/weekly-list/infra/http/routes/weeklyList.routes';
import weeklyListsActive from '@modules/weekly-list/infra/http/routes/weeklyListsActive.routes';
import ordersRoutes from '@modules/orders/infra/http/routes/orders.routes';
import historyOrders from '@modules/orders/infra/http/routes/historyOrders.routes';
import weeklyOffersRoutes from '@modules/weekly-offers/infra/http/routes/weeklyOffers.routes';
import weeklyOffersActive from '@modules/weekly-offers/infra/http/routes/weeklyOffersActive.routes';
import passwordRoutes from '@modules/users/infra/http/routes/password.routes';

const routes = Router();

routes.use('/users', usersRoutes);
routes.use('/sessions', sessionsRoutes);
routes.use('/password', passwordRoutes);

routes.use('/delivery-points', deliveryPointsRoutes);

routes.use('/products', productsRoutes);

routes.use('/weekly-lists', weeklyListRoutes);
routes.use('/active-weekly-lists', weeklyListsActive);

routes.use('/weekly-offers', weeklyOffersRoutes);
routes.use('/active-weekly-offers', weeklyOffersActive);

routes.use('/orders', ordersRoutes);
routes.use('/orders', historyOrders);

export default routes;
