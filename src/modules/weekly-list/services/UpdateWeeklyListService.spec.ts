import AppError from '@shared/errors/AppError';
import FakeWeeklyListsRepository from '../repositories/fakes/FakeWeeklyListsRepository';
import FakeWeeklyListDetailsRepository from '../repositories/fakes/FakeWeeklyListDetailsRepository';
import CreateWeeklyListService from './CreateWeeklyListService';
import UpdateWeeklyListService from './UpdateWeeklyListService';

let fakeWeeklyListsRepository: FakeWeeklyListsRepository;
let fakeWeeklyListDetailsRepository: FakeWeeklyListDetailsRepository;
let createWeeklyList: CreateWeeklyListService;
let updateWeeklyList: UpdateWeeklyListService;

describe('updateWeeklyList', () => {
  beforeEach(() => {
    fakeWeeklyListsRepository = new FakeWeeklyListsRepository();
    fakeWeeklyListDetailsRepository = new FakeWeeklyListDetailsRepository();

    createWeeklyList = new CreateWeeklyListService(
      fakeWeeklyListsRepository,
      fakeWeeklyListDetailsRepository,
    );

    updateWeeklyList = new UpdateWeeklyListService(
      fakeWeeklyListsRepository,
      fakeWeeklyListDetailsRepository,
    );
  });

  it('should be able to update a weekly list', async () => {
    const createdList = await createWeeklyList.execute({
      user_id: '33328f69-9c2b-4424-ad88-c14ac1dd0c0a',
      start_date: new Date(),
      status: 'created',
      details: [
        {
          product_id: 'c625252f-1af4-4164-a8db-f80c499a70d1',
          due_date: new Date(),
          lot: 'january',
          quantity: 10,
          unit_price: 10,
          discount: 10,
          total_price: 10,
        },
      ],
    });

    const updatedList = await updateWeeklyList.execute({
      list_id: createdList.weekly_list.id,
      start_date: createdList.weekly_list.start_date,
      status: 'unavailable',
      details: [
        {
          id: createdList.weekly_list_details[0].id,
          due_date: new Date(),
          lot: 'february',
          quantity: 11,
          unit_price: 11,
          discount: 11,
          total_price: 11,
        },
      ],
    });

    expect(updatedList.weekly_list.status).toBe('unavailable');
    expect(updatedList.weekly_list_details[0].lot).toBe('february');
  });

  it('should be able to update only one detail in the weekly list', async () => {
    const createdList = await createWeeklyList.execute({
      user_id: '33328f69-9c2b-4424-ad88-c14ac1dd0c0a',
      start_date: new Date(),
      status: 'created',
      details: [
        {
          product_id: 'c625252f-1af4-4164-a8db-f80c499a70d1',
          due_date: new Date(),
          lot: 'january',
          quantity: 10,
          unit_price: 10,
          discount: 10,
          total_price: 10,
        },
        {
          product_id: 'c625252f-1af4-4164-a8db-f80c499a70d1',
          due_date: new Date(),
          lot: 'february',
          quantity: 10,
          unit_price: 10,
          discount: 10,
          total_price: 10,
        },
      ],
    });

    const updatedList = await updateWeeklyList.execute({
      list_id: createdList.weekly_list.id,
      start_date: createdList.weekly_list.start_date,
      status: 'created',
      details: [
        {
          id: createdList.weekly_list_details[1].id,
          due_date: new Date(),
          lot: 'february',
          quantity: 20,
          unit_price: 20,
          discount: 20,
          total_price: 20,
        },
      ],
    });

    expect(updatedList.weekly_list_details[1].quantity).toBe(10);
    expect(updatedList.weekly_list_details[0].quantity).toBe(20);
  });

  it('should not be able to update a weekly list with non-existing list id', async () => {
    await expect(
      updateWeeklyList.execute({
        list_id: 'non-existing list id',
        start_date: new Date(),
        status: 'unavailable',
        details: [
          {
            id: '1',
            due_date: new Date(),
            lot: 'february',
            quantity: 11,
            unit_price: 11,
            discount: 11,
            total_price: 11,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
