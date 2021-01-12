import AppError from '@shared/errors/AppError';
import FakeOrderDetailsRepository from '../repositories/fakes/FakeOrderDetailsRespository';
import FakeOrdersRepository from '../repositories/fakes/FakeOrdersRespository';
import CreateOrderService from './CreateOrderService';
import { fakeOrder } from './mocks';
import ShowOrderService from './ShowOrderService';

let fakeOrdersRepository: FakeOrdersRepository;
let fakeOrderDetailsRepository: FakeOrderDetailsRepository;
let createOrderService: CreateOrderService;
let showOrderService: ShowOrderService;

describe('ShowOrderService', () => {
  beforeEach(() => {
    fakeOrdersRepository = new FakeOrdersRepository();
    fakeOrderDetailsRepository = new FakeOrderDetailsRepository();

    createOrderService = new CreateOrderService(
      fakeOrdersRepository,
      fakeOrderDetailsRepository,
    );

    showOrderService = new ShowOrderService(
      fakeOrdersRepository,
      fakeOrderDetailsRepository,
    );
  });

  it('should be able to show a order', async () => {
    const { order } = await createOrderService.execute(fakeOrder);

    const { order: orderFound } = await showOrderService.execute({
      order_id: order.id,
    });

    expect(orderFound.id).toBe(order.id);
  });

  it('should not be able to show a order from non existing order id', async () => {
    await expect(
      showOrderService.execute({
        order_id: 'non-existing order id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
