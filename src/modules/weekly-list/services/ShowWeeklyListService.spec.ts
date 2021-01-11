import AppError from '@shared/errors/AppError';
import FakeWeeklyListsRepository from '../repositories/fakes/FakeWeeklyListsRepository';
import FakeWeeklyListDetailsRepository from '../repositories/fakes/FakeWeeklyListDetailsRepository';
import CreateWeeklyListService from './CreateWeeklyListService';
import ShowWeeklyListService from './ShowWeeklyListService';

let fakeWeeklyListsRepository: FakeWeeklyListsRepository;
let fakeWeeklyListDetailsRepository: FakeWeeklyListDetailsRepository;
let createWeeklyList: CreateWeeklyListService;
let showWeeklyList: ShowWeeklyListService;

describe('showWeeklyList', () => {
  beforeEach(() => {
    fakeWeeklyListsRepository = new FakeWeeklyListsRepository();
    fakeWeeklyListDetailsRepository = new FakeWeeklyListDetailsRepository();

    createWeeklyList = new CreateWeeklyListService(
      fakeWeeklyListsRepository,
      fakeWeeklyListDetailsRepository,
    );

    showWeeklyList = new ShowWeeklyListService(
      fakeWeeklyListsRepository,
      fakeWeeklyListDetailsRepository,
    );
  });

  it('should be able to show a weekly list', async () => {
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

    const list = await showWeeklyList.execute({
      list_id: createdList.weekly_list.id,
    });

    expect(list.weekly_list.user_id).toBe(
      '33328f69-9c2b-4424-ad88-c14ac1dd0c0a',
    );
    expect(list.weekly_list_details[0].lot).toBe('january');
  });

  it('should not be able to show a weekly list from non existing list id', async () => {
    await expect(
      showWeeklyList.execute({
        list_id: 'non-existing list id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
