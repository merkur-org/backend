import FakeWeeklyOffersDetailsRepository from '../repositories/fakes/FakeWeeklyOffersDetailsRepository';
import FakeWeeklyOffersRepository from '../repositories/fakes/FakeWeeklyOffersRepository';
import CreateWeeklyOffersService from './CreateWeeklyOffersService';

let fakeWeeklyOffersDetailsRepository: FakeWeeklyOffersDetailsRepository;
let fakeWeeklyOffersRepository: FakeWeeklyOffersRepository;
let createWeeklyOffers: CreateWeeklyOffersService;

describe('CreateWeeklyOffer', () => {
  beforeEach(() => {
    fakeWeeklyOffersDetailsRepository = new FakeWeeklyOffersDetailsRepository();
    fakeWeeklyOffersRepository = new FakeWeeklyOffersRepository();

    createWeeklyOffers = new CreateWeeklyOffersService(
      fakeWeeklyOffersRepository,
      fakeWeeklyOffersDetailsRepository,
    );
  });

  it('should be able to create a new weekly list', async () => {
    const list = await createWeeklyOffers.execute({
      user_id: '33328f69-9c2b-4424-ad88-c14ac1dd0c0a',
      start_date: new Date(),
      end_date: new Date(),
      status: 'created',
      details: [
        {
          product_id: 'c625252f-1af4-4164-a8db-f80c499a70d1',
          unit_price: 10,
          quantity: 10,
          sale_price: 1,
        },
      ],
    });

    expect(list.weekly_offer).toHaveProperty('id');
    expect(list.weekly_offer_details[0]).toHaveProperty('id');
  });
});
