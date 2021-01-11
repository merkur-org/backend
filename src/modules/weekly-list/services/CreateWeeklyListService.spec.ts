import FakeWeeklyListsRepository from '../repositories/fakes/FakeWeeklyListsRepository';
import FakeWeeklyListDetailsRepository from '../repositories/fakes/FakeWeeklyListDetailsRepository';
import CreateWeeklyListService from './CreateWeeklyListService';

let fakeWeeklyListsRepository: FakeWeeklyListsRepository;
let fakeWeeklyListDetailsRepository: FakeWeeklyListDetailsRepository;
let createWeeklyList: CreateWeeklyListService;

describe('CreateWeeklyList', () => {
  beforeEach(() => {
    fakeWeeklyListsRepository = new FakeWeeklyListsRepository();
    fakeWeeklyListDetailsRepository = new FakeWeeklyListDetailsRepository();

    createWeeklyList = new CreateWeeklyListService(
      fakeWeeklyListsRepository,
      fakeWeeklyListDetailsRepository,
    );
  });

  it('should be able to create a new weekly list', async () => {
    const list = await createWeeklyList.execute({
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

    expect(list.weekly_list).toHaveProperty('id');
    expect(list.weekly_list_details[0]).toHaveProperty('id');
  });
});
