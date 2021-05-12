// import AppError from '@shared/errors/AppError';
import CreateOrder from '@modules/orders/services/CreateOrderService';
import FakeOrderDetailsRepository from '../repositories/fakes/FakeOrderDetailsRespository';
import FakeOrdersRepository from '../repositories/fakes/FakeOrdersRespository';

let fakeOrdersRepository: FakeOrdersRepository;
let fakeOrderDetailsRepository: FakeOrderDetailsRepository;
let createOrder: CreateOrder;

describe('CreateOrder', () => {
  beforeEach(() => {
    fakeOrdersRepository = new FakeOrdersRepository();
    fakeOrderDetailsRepository = new FakeOrderDetailsRepository();

    createOrder = new CreateOrder(
      fakeOrdersRepository,
      fakeOrderDetailsRepository,
    );
  });

  it('should be able to create a new order', async () => {
    const order = await createOrder.execute({
      date: new Date(),
      delivery_point_id: 'c13d9f6c-d27c-4175-886c-ce4b653fc68d',
      list_id: 'c13d9f6c-d27c-4175-886c-ce4b653fc68d',
      final_value: 45,
      payment_status: 'processing',
      payment_type: 'credit_card',
      sales_type: 'wholesale',
      value: 456,
      user_id: 'user-id',
      details: [
        {
          product_id: '5971f952-d12a-4493-ba85-5fd976db275c',
          unit_price: 22,
          quantity: 2,
          discount: 1,
        },
      ],
    });
    expect(order).toHaveProperty('order');
    expect(order).toHaveProperty('order_details');
  });
});
