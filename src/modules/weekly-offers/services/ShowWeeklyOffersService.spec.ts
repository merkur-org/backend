import AppError from '@shared/errors/AppError';
import FakeWeeklyOffersRepository from '../repositories/fakes/FakeWeeklyOffersRepository';
import FakeWeeklyOfferDetailsRepository from '../repositories/fakes/FakeWeeklyOffersDetailsRepository';
import CreateWeeklyOfferService from './CreateWeeklyOffersService';
import ShowWeeklyOfferService from './ShowWeeklyOffersService';

let fakeWeeklyOffersRepository: FakeWeeklyOffersRepository;
let fakeWeeklyOfferDetailsRepository: FakeWeeklyOfferDetailsRepository;
let createWeeklyOffer: CreateWeeklyOfferService;
let showWeeklyOffer: ShowWeeklyOfferService;

describe('showWeeklyOffer', () => {
  beforeEach(() => {
    fakeWeeklyOffersRepository = new FakeWeeklyOffersRepository();
    fakeWeeklyOfferDetailsRepository = new FakeWeeklyOfferDetailsRepository();

    createWeeklyOffer = new CreateWeeklyOfferService(
      fakeWeeklyOffersRepository,
      fakeWeeklyOfferDetailsRepository,
    );

    showWeeklyOffer = new ShowWeeklyOfferService(
      fakeWeeklyOffersRepository,
      fakeWeeklyOfferDetailsRepository,
    );
  });

  it('should be able to show a weekly offer', async () => {
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

    const offer = await showWeeklyOffer.execute({
      offer_id: createdOffer.weekly_offer.id,
    });

    expect(offer.weekly_offer.user_id).toBe(
      '33328f69-9c2b-4424-ad88-c14ac1dd0c0a',
    );
  });

  it('should not be able to show a weekly offer from non existing offer id', async () => {
    await expect(
      showWeeklyOffer.execute({
        offer_id: 'non-existing offer id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
