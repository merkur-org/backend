import AppError from '@shared/errors/AppError';
import FakeWeeklyListsRepository from '../repositories/fakes/FakeWeeklyListsRepository';
import FakeWeeklyListDetailsRepository from '../repositories/fakes/FakeWeeklyListDetailsRepository';
import CreateWeeklyListService from './CreateWeeklyListService';
import ListWeeklyListsService from './ListWeeklyListsService';

let fakeWeeklyListsRepository: FakeWeeklyListsRepository;
let fakeWeeklyListDetailsRepository: FakeWeeklyListDetailsRepository;
let createWeeklyList: CreateWeeklyListService;
let listWeeklyList: ListWeeklyListsService;

describe('listWeeklyList', () => {
  beforeEach(() => {
    fakeWeeklyListsRepository = new FakeWeeklyListsRepository();
    fakeWeeklyListDetailsRepository = new FakeWeeklyListDetailsRepository();

    createWeeklyList = new CreateWeeklyListService(
      fakeWeeklyListsRepository,
      fakeWeeklyListDetailsRepository,
    );

    listWeeklyList = new ListWeeklyListsService(
      fakeWeeklyListsRepository,
      fakeWeeklyListDetailsRepository,
    );
  });

  it('should be able to list a weekly list', async () => {
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

    const lists = await listWeeklyList.execute({
      user_id: createdList.weekly_list.user_id,
      page: 1,
      limit: 10,
    });

    expect(lists.data.length).toBe(1);
    expect(lists.limit).toBe(10);
    expect(lists.page).toBe(1);
    expect(lists.totalCount).toBe(1);
  });

  it('should be able to list more than one weekly list', async () => {
    const createdList1 = await createWeeklyList.execute({
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
    await createWeeklyList.execute({
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
    await createWeeklyList.execute({
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

    const lists = await listWeeklyList.execute({
      user_id: createdList1.weekly_list.user_id,
      page: 1,
      limit: 1,
    });

    expect(lists.data.length).toBe(1);
    expect(lists.limit).toBe(1);
    expect(lists.page).toBe(1);
    expect(lists.totalCount).toBe(3);
  });

  it('should not be able to list a weekly list with non-existing user id', async () => {
    await expect(
      listWeeklyList.execute({
        user_id: 'non-existing user id',
        page: 1,
        limit: 10,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
