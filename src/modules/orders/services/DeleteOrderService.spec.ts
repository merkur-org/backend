import AppError from '@shared/errors/AppError';
import FakeOrdersRespository from '../repositories/fakes/FakeOrdersRespository';
import FakeOrderDetailsRespository from '../repositories/fakes/FakeOrderDetailsRespository';
import CreateOrderService from './CreateOrderService';
import DeleteOrderService from './DeleteOrderService';
import { fakeOrder } from './mocks';

let fakeOrdersRespository: FakeOrdersRespository;
let fakeOrderDetailsRespository: FakeOrderDetailsRespository;
let createOrder: CreateOrderService;
let deleteOrderService: DeleteOrderService;

describe('DeleteOrder', () => {
  beforeEach(() => {
    fakeOrdersRespository = new FakeOrdersRespository();
    fakeOrderDetailsRespository = new FakeOrderDetailsRespository();

    createOrder = new CreateOrderService(
      fakeOrdersRespository,
      fakeOrderDetailsRespository,
    );

    deleteOrderService = new DeleteOrderService(fakeOrdersRespository);
  });

  it('should be able to delete one order', async () => {
    const { order } = await createOrder.execute(fakeOrder);

    const message = await deleteOrderService.execute({ order_id: order.id });

    expect(message).toHaveProperty('message');
  });

  it('should not be able to delete order if the given id does not exist', async () => {
    await expect(
      deleteOrderService.execute({ order_id: 'non-existing-order-id' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
