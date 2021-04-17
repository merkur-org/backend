import FakeOrderDetailsRepository from '../repositories/fakes/FakeOrderDetailsRespository';
import FakeOrdersRepository from '../repositories/fakes/FakeOrdersRespository';
import CreateOrderService from './CreateOrderService';
import ListOrdersService from './ListOrdersService';
import { fakeOrder, fakeOrder1 } from './mocks';

let fakeOrdersRepository: FakeOrdersRepository;
let fakeOrderDetailsRepository: FakeOrderDetailsRepository;
let createOrder: CreateOrderService;
let listOrders: ListOrdersService;

describe('ListOrders', () => {
  beforeEach(() => {
    fakeOrdersRepository = new FakeOrdersRepository();
    fakeOrderDetailsRepository = new FakeOrderDetailsRepository();

    createOrder = new CreateOrderService(
      fakeOrdersRepository,
      fakeOrderDetailsRepository,
    );

    listOrders = new ListOrdersService(fakeOrdersRepository);
  });

  it('should be able to list a order', async () => {
    const { data, limit, page, total_count } = await listOrders.execute({
      page: 1,
      limit: 10,
    });

    expect(data.length).toBe(0);
    expect(limit).toBe(10);
    expect(page).toBe(1);
    expect(total_count).toBe(0);
  });

  it('should be able to list more than one order', async () => {
    await createOrder.execute(fakeOrder);
    await createOrder.execute(fakeOrder1);

    const orders = await listOrders.execute({
      page: 1,
      limit: 1,
    });

    expect(orders.data.length).toBe(1);
    expect(orders.limit).toBe(1);
    expect(orders.page).toBe(1);
    expect(orders.total_count).toBe(2);
  });
});
