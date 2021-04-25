import { container } from 'tsyringe';

import '@modules/users/providers';
import './providers';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';

import IDeliveryPointsRepository from '@modules/delivery-points/repositories/IDeliveryPointsRepository';
import DeliveryPointsRepository from '@modules/delivery-points/infra/typeorm/repositories/DeliveryPointsRepository';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ProductsRepository from '@modules/products/infra/typeorm/repositories/ProductsRepository';

import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import OrdersRepository from '@modules/orders/infra/typeorm/repositories/OrdersRepository';

import IOrderDetailsRepository from '@modules/orders/repositories/IOrderDetailsRepository';
import OrderDetailsRepository from '@modules/orders/infra/typeorm/repositories/OrderDetailsRepository';

import ListOffersDetailsRepository from '@modules/lists/infra/typeorm/repositories/ListOffersDetailsRepository';
import IListOffersDetailsRepository from '@modules/lists/repositories/IListOffersDetailsRepository';

import ListProducersDetailsRepository from '@modules/lists/infra/typeorm/repositories/ListProducersDetailsRepository';
import IListProducersDetailsRepository from '@modules/lists/repositories/IListProducersDetailsRepository';

import ListsRepository from '@modules/lists/infra/typeorm/repositories/ListsRepository';
import IListsRepository from '@modules/lists/repositories/IListsRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IUserTokensRepository>(
  'UserTokensRepository',
  UserTokensRepository,
);

container.registerSingleton<IDeliveryPointsRepository>(
  'DeliveryPointsRepository',
  DeliveryPointsRepository,
);

container.registerSingleton<IProductsRepository>(
  'ProductsRepository',
  ProductsRepository,
);

container.registerSingleton<IOrdersRepository>(
  'OrdersRepository',
  OrdersRepository,
);

container.registerSingleton<IOrderDetailsRepository>(
  'OrderDetailsRepository',
  OrderDetailsRepository,
);

container.registerSingleton<IListOffersDetailsRepository>(
  'ListOffersDetailsRepository',
  ListOffersDetailsRepository,
);

container.registerSingleton<IListProducersDetailsRepository>(
  'ListProducersDetailsRepository',
  ListProducersDetailsRepository,
);

container.registerSingleton<IListsRepository>(
  'ListsRepository',
  ListsRepository,
);
