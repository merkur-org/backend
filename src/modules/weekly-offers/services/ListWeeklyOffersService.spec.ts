import AppError from '@shared/errors/AppError';
import FakeWeeklyOffersRepository from '../repositories/fakes/FakeWeeklyOffersRepository';
import FakeWeeklyOffersDetailsRepository from '../repositories/fakes/FakeWeeklyOffersDetailsRepository';
import CreateWeeklyOffersService from './CreateWeeklyOffersService';
import ListWeeklyOffersService from './ListWeeklyOffersService';

let fakeWeeklyOffersRepository: FakeWeeklyOffersRepository;
let fakeWeeklyOfferDetailsRepository: FakeWeeklyOffersDetailsRepository;
let createWeeklyOffer: CreateWeeklyOffersService;
let listWeeklyOffer: ListWeeklyOffersService;

describe('listWeeklyOffer', () => {
  beforeEach(() => {
    fakeWeeklyOffersRepository = new FakeWeeklyOffersRepository();
    fakeWeeklyOfferDetailsRepository = new FakeWeeklyOffersDetailsRepository();

    createWeeklyOffer = new CreateWeeklyOffersService(
      fakeWeeklyOffersRepository,
      fakeWeeklyOfferDetailsRepository,
    );

    listWeeklyOffer = new ListWeeklyOffersService(
      fakeWeeklyOffersRepository,
      fakeWeeklyOfferDetailsRepository,
    );
  });

  it('should be able to offer a weekly offer', async () => {
    const createdOffer = await createWeeklyOffer.execute({
      user_id: '33328f69-9c2b-4424-ad88-c14ac1dd0c0a',
      status: 'created',
      start_date: new Date(),
      end_date: new Date(),
      details: [
        {
          product_id: 'c625252f-1af4-4164-a8db-f80c499a70d1',
          quantity: 10,
          unit_price: 10,
          sale_price: 1,
        },
      ],
    });

    const offers = await listWeeklyOffer.execute({
      user_id: createdOffer.weekly_offer.user_id,
      page: 1,
      limit: 10,
    });

    expect(offers.data.length).toBe(1);
    expect(offers.limit).toBe(10);
    expect(offers.page).toBe(1);
    expect(offers.totalCount).toBe(1);
  });

  it('should be able to offer more than one weekly offer', async () => {
    const createdOffer1 = await createWeeklyOffer.execute({
      user_id: '33328f69-9c2b-4424-ad88-c14ac1dd0c0a',
      status: 'created',
      start_date: new Date(),
      end_date: new Date(),
      details: [
        {
          product_id: 'c625252f-1af4-4164-a8db-f80c499a70d1',
          quantity: 10,
          unit_price: 10,
          sale_price: 1,
        },
      ],
    });
    await createWeeklyOffer.execute({
      user_id: '33328f69-9c2b-4424-ad88-c14ac1dd0c0a',
      status: 'created',
      start_date: new Date(),
      end_date: new Date(),
      details: [
        {
          product_id: 'c625252f-1af4-4164-a8db-f80c499a70d1',
          quantity: 10,
          unit_price: 10,
          sale_price: 1,
        },
      ],
    });
    await createWeeklyOffer.execute({
      user_id: '33328f69-9c2b-4424-ad88-c14ac1dd0c0a',
      status: 'created',
      start_date: new Date(),
      end_date: new Date(),
      details: [
        {
          product_id: 'c625252f-1af4-4164-a8db-f80c499a70d1',
          quantity: 10,
          unit_price: 10,
          sale_price: 1,
        },
      ],
    });

    const offers = await listWeeklyOffer.execute({
      user_id: createdOffer1.weekly_offer.user_id,
      page: 1,
      limit: 1,
    });

    expect(offers.data.length).toBe(1);
    expect(offers.limit).toBe(1);
    expect(offers.page).toBe(1);
    expect(offers.totalCount).toBe(3);
  });

  it('should not be able to offer a weekly offer with non-existing user id', async () => {
    await expect(
      listWeeklyOffer.execute({
        user_id: 'non-existing user id',
        page: 1,
        limit: 10,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
