import FakeListOffersDetailsRepository from '../repositories/fakes/FakeListOffersDetailsRepository';
import FakeListsRepository from '../repositories/fakes/FakeListsRepository';
import FakeListProducersDetailsRepository from '../repositories/fakes/FakeListProducersDetailsRepository';
import CreateListService from './CreateListService';

let fakeListOffersDetailsRepository: FakeListOffersDetailsRepository;
let fakeListsRepository: FakeListsRepository;
let fakeListProducersDetailsRepository: FakeListProducersDetailsRepository;
let createListService: CreateListService;

describe('CreateListService', () => {
  beforeEach(() => {
    fakeListsRepository = new FakeListsRepository();
    fakeListProducersDetailsRepository = new FakeListProducersDetailsRepository();
    fakeListOffersDetailsRepository = new FakeListOffersDetailsRepository();

    createListService = new CreateListService(
      fakeListsRepository,
      fakeListProducersDetailsRepository,
      fakeListOffersDetailsRepository,
    );
  });

  it('should be able to create a new weekly list', async () => {
    const list = await createListService.execute({
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

    expect(list.list).toHaveProperty('id');
    expect(list.details[0]).toHaveProperty('id');
  });
});
