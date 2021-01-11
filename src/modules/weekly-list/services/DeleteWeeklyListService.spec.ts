import AppError from '@shared/errors/AppError';
import FakeWeeklyListsRepository from '../repositories/fakes/FakeWeeklyListsRepository';
import FakeWeeklyListDetailsRepository from '../repositories/fakes/FakeWeeklyListDetailsRepository';
import CreateWeeklyListService from './CreateWeeklyListService';
import DeleteWeeklyListService from './DeleteWeeklyListService';

let fakeWeeklyListsRepository: FakeWeeklyListsRepository;
let fakeWeeklyListDetailsRepository: FakeWeeklyListDetailsRepository;
let createWeeklyList: CreateWeeklyListService;
let deleteWeeklyList: DeleteWeeklyListService;

describe('DeleteWeeklyList', () => {
  beforeEach(() => {
    fakeWeeklyListsRepository = new FakeWeeklyListsRepository();
    fakeWeeklyListDetailsRepository = new FakeWeeklyListDetailsRepository();

    createWeeklyList = new CreateWeeklyListService(
      fakeWeeklyListsRepository,
      fakeWeeklyListDetailsRepository,
    );

    deleteWeeklyList = new DeleteWeeklyListService(
      fakeWeeklyListsRepository,
      fakeWeeklyListDetailsRepository,
    );
  });

  it('should be able to delete a weekly list', async () => {
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

    const message = await deleteWeeklyList.execute({
      list_id: list.weekly_list.id,
    });

    expect(message).toHaveProperty('message');
  });

  it('should not be able to delete the weekly list if the given id does not exist', async () => {
    await expect(
      deleteWeeklyList.execute({ list_id: 'non-existing-point-id' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
