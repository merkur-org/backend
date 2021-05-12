import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import CreateUserService from '@modules/users/services/CreateUserService';
import FakeOrderDetailsRepository from '../repositories/fakes/FakeOrderDetailsRespository';
import FakeOrdersRepository from '../repositories/fakes/FakeOrdersRespository';
import CreateOrderService from './CreateOrderService';
import ListHistoryOrdersByUserIdService from './ListHistoryOrdersByUserIdService';

let fakeOrdersRepository: FakeOrdersRepository;
let fakeOrderDetailsRepository: FakeOrderDetailsRepository;
let createOrder: CreateOrderService;
let listHistoryOrdersByUserIdService: ListHistoryOrdersByUserIdService;

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe('ListHistoryOrdersByUserId', () => {
  beforeEach(() => {
    fakeOrdersRepository = new FakeOrdersRepository();
    fakeOrderDetailsRepository = new FakeOrderDetailsRepository();

    createOrder = new CreateOrderService(
      fakeOrdersRepository,
      fakeOrderDetailsRepository,
    );

    listHistoryOrdersByUserIdService = new ListHistoryOrdersByUserIdService(
      fakeOrdersRepository,
    );

    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
  });

  it('should be able to list a history orders from user', async () => {
    const { user } = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '46 99999999',
      password: '123456',
      cpf: '123456789',
    });

    await createOrder.execute({
      date: new Date(),
      delivery_point_id: 'c13d9f6c-d27c-4175-886c-ce4b653fc68d',
      final_value: 45,
      payment_status: 'processing',
      payment_type: 'credit_card',
      sales_type: 'wholesale',
      value: 456,
      list_id: 'list-id',
      user_id: user.id,
      details: [
        {
          product_id: '5971f952-d12a-4493-ba85-5fd976db275c',
          unit_price: 22,
          quantity: 2,
          discount: 1,
        },
      ],
    });

    const {
      data,
      limit,
      page,
      total_count,
    } = await listHistoryOrdersByUserIdService.execute({
      page: 1,
      user_id: user.id,
      limit: 10,
    });

    expect(data.length).toBe(1);
    expect(limit).toBe(10);
    expect(page).toBe(1);
    expect(total_count).toBe(1);
  });
});
