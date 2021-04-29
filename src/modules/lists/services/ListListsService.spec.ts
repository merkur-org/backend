import FakeListOffersDetailsRepository from '../repositories/fakes/FakeListOffersDetailsRepository';
import FakeListProducersDetailsRepository from '../repositories/fakes/FakeListProducersDetailsRepository';
import FakeListsRepository from '../repositories/fakes/FakeListsRepository';
import CreateListService from './CreateListService';
import ListListsService from './ListListsService';

let fakeListOffersDetailsRepository: FakeListOffersDetailsRepository;
let fakeListsRepository: FakeListsRepository;
let fakeListProducersDetailsRepository: FakeListProducersDetailsRepository;
let createList: CreateListService;
let listLists: ListListsService;

describe('CreateListService', () => {
  beforeEach(() => {
    fakeListsRepository = new FakeListsRepository();
    fakeListProducersDetailsRepository = new FakeListProducersDetailsRepository();
    fakeListOffersDetailsRepository = new FakeListOffersDetailsRepository();

    createList = new CreateListService(
      fakeListsRepository,
      fakeListProducersDetailsRepository,
      fakeListOffersDetailsRepository,
    );

    listLists = new ListListsService(fakeListsRepository);
  });

  it('should be able to list a list', async () => {
    const createdList = await createList.execute({
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

    const lists = await listLists.execute({
      user_id: createdList.list.user_id,
      page: 1,
      limit: 10,
    });

    expect(lists.data.length).toBe(1);
    expect(lists.limit).toBe(10);
    expect(lists.page).toBe(1);
    expect(lists.total_count).toBe(1);
  });

  it('should be able to list more than one list', async () => {
    const createdList1 = await createList.execute({
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
    await createList.execute({
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
    await createList.execute({
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

    const lists = await listLists.execute({
      user_id: createdList1.list.user_id,
      page: 1,
      limit: 1,
    });

    expect(lists.data.length).toBe(1);
    expect(lists.limit).toBe(1);
    expect(lists.page).toBe(1);
    expect(lists.total_count).toBe(3);
  });

  it('should not be able to list a list with non-existing user id', async () => {
    const lists = await listLists.execute({
      user_id: 'non-existing user id',
      page: 1,
      limit: 10,
    });

    expect(lists.data.length === 0);
  });
});
