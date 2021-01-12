import AppError from '@shared/errors/AppError';
import UpdateOrder from '@modules/orders/services/UpdateOrderService';
import CreateOrder from '@modules/orders/services/CreateOrderService';
import FakeOrderDetailsRepository from '../repositories/fakes/FakeOrderDetailsRespository';
import FakeOrdersRepository from '../repositories/fakes/FakeOrdersRespository';

import OrderDetail from '../infra/typeorm/entities/OrderDetail';
import Order from '../infra/typeorm/entities/Order';
import { fakeOrder } from './mocks';

let fakeOrdersRepository: FakeOrdersRepository;
let fakeOrderDetailsRepository: FakeOrderDetailsRepository;
let updateOrder: UpdateOrder;
let createOrder: CreateOrder;

describe('UpdateOrder', () => {
  beforeEach(() => {
    fakeOrdersRepository = new FakeOrdersRepository();
    fakeOrderDetailsRepository = new FakeOrderDetailsRepository();

    updateOrder = new UpdateOrder(
      fakeOrdersRepository,
      fakeOrderDetailsRepository,
    );

    createOrder = new CreateOrder(
      fakeOrdersRepository,
      fakeOrderDetailsRepository,
    );
  });

  it('should be able to create a new order', async () => {
    let response = await createOrder.execute(fakeOrder);

    response.order.value = 10;

    response = await updateOrder.execute({
      order: response.order,
      details: response.order_details,
    });

    expect(response).toHaveProperty('order');
    expect(response).toHaveProperty('order_details');
    expect(response.order.value).toBe(10);
  });

  it('should not be able to update an order that does not exist or that has no details', async () => {
    const order = new Order();
    order.id = 'non-exists';

    const order_details = [] as OrderDetail[];

    await expect(
      updateOrder.execute({
        order,
        details: order_details,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should to maintain data that is not required to update', async () => {
    const { order, order_details } = await createOrder.execute(fakeOrder);
    const orderUpdate = new Order();
    const orderDetailUpdate = new OrderDetail();
    orderUpdate.id = order.id;
    orderDetailUpdate.id = order_details[0].id;
    const response = await updateOrder.execute({
      order: orderUpdate,
      details: [orderDetailUpdate],
    });

    expect(response).toHaveProperty('order');
    expect(response).toHaveProperty('order_details');
  });
});
