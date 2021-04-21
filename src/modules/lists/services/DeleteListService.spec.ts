import AppError from '@shared/errors/AppError';
import FakeListOffersDetailsRepository from '../repositories/fakes/FakeListOffersDetailsRepository';
import FakeListProducersDetailsRepository from '../repositories/fakes/FakeListProducersDetailsRepository';
import FakeListsReposiroty from '../repositories/fakes/FakeListsReposiroty';
import CreateListService from './CreateListService';
import DeleteListService from './DeleteListService';

let fakeListOffersDetailsRepository: FakeListOffersDetailsRepository;
let fakeListsReposiroty: FakeListsReposiroty;
let fakeListProducersDetailsRepository: FakeListProducersDetailsRepository;
let createList: CreateListService;
let deleteList: DeleteListService;

describe('CreateListService', () => {
  beforeEach(() => {
    fakeListsReposiroty = new FakeListsReposiroty();
    fakeListProducersDetailsRepository = new FakeListProducersDetailsRepository();
    fakeListOffersDetailsRepository = new FakeListOffersDetailsRepository();

    createList = new CreateListService(
      fakeListsReposiroty,
      fakeListProducersDetailsRepository,
      fakeListOffersDetailsRepository,
    );

    deleteList = new DeleteListService(fakeListsReposiroty);
  });

  it('should be able to delete a weekly list', async () => {
    const { list } = await createList.execute({
      user_id: '33328f69-9c2b-4424-ad88-c14ac1dd0c0a',
      start_date: new Date(),
      end_date: new Date(),
      type: 'offer',
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

    const message = await deleteList.execute({
      list_id: list.id,
    });

    expect(message).toHaveProperty('message');
  });

  it('should not be able to delete the weekly list if the given id does not exist', async () => {
    await expect(
      deleteList.execute({ list_id: 'non-existing-point-id' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
