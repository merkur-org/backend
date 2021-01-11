// import AppError from '@shared/errors/AppError';
import UpdateOrder from '@modules/orders/services/UpdateOrderService';
import CreateOrder from '@modules/orders/services/CreateOrderService';
import FakeOrderDetailsRepository from '../repositories/fakes/FakeOrderDetailsRespository';
import FakeOrdersRepository from '../repositories/fakes/FakeOrdersRespository';
import {
  IPaymentStatus,
  ISalesType,
  IPaymentType,
} from '../infra/typeorm/entities/Order';

let fakeOrdersRepository: FakeOrdersRepository;
let fakeOrderDetailsRepository: FakeOrderDetailsRepository;
let updateOrder: UpdateOrder;
let createOrder: CreateOrder;

const fakeOrder = {
  date: new Date(),
  delivery_point_id: 'c13d9f6c-d27c-4175-886c-ce4b653fc68d',
  final_value: 45,
  payment_status: 'processing' as IPaymentStatus,
  payment_type: 'credit_card' as IPaymentType,
  sales_type: 'wholesale' as ISalesType,
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
};

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

  it('should be able to create a new user', async () => {
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
});
