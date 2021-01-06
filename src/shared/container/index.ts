import { container } from 'tsyringe';

import '@modules/users/providers';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

import IDeliveryPointsRepository from '@modules/delivery-points/repositories/IDeliveryPointsRepository';
import DeliveryPointsRepository from '@modules/delivery-points/infra/typeorm/repositories/DeliveryPointsRepository';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ProductsRepository from '@modules/products/infra/typeorm/repositories/ProductsRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IDeliveryPointsRepository>(
  'DeliveryPointsRepository',
  DeliveryPointsRepository,
);

container.registerSingleton<IProductsRepository>(
  'ProductsRepository',
  ProductsRepository,
);
