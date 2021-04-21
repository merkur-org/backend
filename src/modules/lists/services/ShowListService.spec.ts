import AppError from '@shared/errors/AppError';
import FakeListOffersDetailsRepository from '../repositories/fakes/FakeListOffersDetailsRepository';
import FakeListProducersDetailsRepository from '../repositories/fakes/FakeListProducersDetailsRepository';
import FakeListsReposiroty from '../repositories/fakes/FakeListsReposiroty';
import CreateListService from './CreateListService';
import ShowListService from './ShowListService';

let fakeListOffersDetailsRepository: FakeListOffersDetailsRepository;
let fakeListsReposiroty: FakeListsReposiroty;
let fakeListProducersDetailsRepository: FakeListProducersDetailsRepository;
let createListService: CreateListService;
let showListService: ShowListService;

describe('ShowListService', () => {
  beforeEach(() => {
    fakeListsReposiroty = new FakeListsReposiroty();
    fakeListProducersDetailsRepository = new FakeListProducersDetailsRepository();
    fakeListOffersDetailsRepository = new FakeListOffersDetailsRepository();

    createListService = new CreateListService(
      fakeListsReposiroty,
      fakeListProducersDetailsRepository,
      fakeListOffersDetailsRepository,
    );

    showListService = new ShowListService(
      fakeListsReposiroty,
      fakeListProducersDetailsRepository,
      fakeListOffersDetailsRepository,
    );
  });

  it('should be able to show a weekly list', async () => {
    const createdList = await createListService.execute({
      user_id: '33328f69-9c2b-4424-ad88-c14ac1dd0c0a',
      start_date: new Date(),
      end_date: new Date(),
      type: 'producer',
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

    const list = await showListService.execute({
      list_id: createdList.list.id,
    });

    expect(list.list.user_id).toBe('33328f69-9c2b-4424-ad88-c14ac1dd0c0a');
    expect(list.details[0].product_id).toBe(
      'c625252f-1af4-4164-a8db-f80c499a70d1',
    );
  });

  it('should not be able to show a weekly list from non existing list id', async () => {
    await expect(
      showListService.execute({
        list_id: 'non-existing list id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
