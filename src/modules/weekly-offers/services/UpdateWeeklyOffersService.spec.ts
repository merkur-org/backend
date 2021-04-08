import AppError from '@shared/errors/AppError';
import FakeWeeklyOffersRepository from '../repositories/fakes/FakeWeeklyOffersRepository';
import FakeWeeklyOffersDetailsRepository from '../repositories/fakes/FakeWeeklyOffersDetailsRepository';
import CreateWeeklyOffersService from './CreateWeeklyOffersService';
import UpdateWeeklyOffersService from './UpdateWeeklyOffersService';

let fakeWeeklyOffersRepository: FakeWeeklyOffersRepository;
let fakeWeeklyOfferDetailsRepository: FakeWeeklyOffersDetailsRepository;
let createWeeklyOffer: CreateWeeklyOffersService;
let updateWeeklyOffer: UpdateWeeklyOffersService;

describe('updateWeeklyOffer', () => {
  beforeEach(() => {
    fakeWeeklyOffersRepository = new FakeWeeklyOffersRepository();
    fakeWeeklyOfferDetailsRepository = new FakeWeeklyOffersDetailsRepository();

    createWeeklyOffer = new CreateWeeklyOffersService(
      fakeWeeklyOffersRepository,
      fakeWeeklyOfferDetailsRepository,
    );

    updateWeeklyOffer = new UpdateWeeklyOffersService(
      fakeWeeklyOffersRepository,
      fakeWeeklyOfferDetailsRepository,
    );
  });

  it('should be able to update a weekly offer', async () => {
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

    const updatedOffer = await updateWeeklyOffer.execute({
      offer_id: createdOffer.weekly_offer.id,
      start_date: createdOffer.weekly_offer.start_date,
      end_date: createdOffer.weekly_offer.end_date,
      status: 'unavailable',
      details: [
        {
          id: createdOffer.weekly_offer_details[0].id,
          quantity: 11,
          unit_price: 11,
          sale_price: 2,
        },
      ],
    });

    expect(updatedOffer.weekly_offer.status).toBe('unavailable');
  });

  it('should be able to update only one detail in the weekly offer', async () => {
    const createdOffer = await createWeeklyOffer.execute({
      user_id: '33328f69-9c2b-4424-ad88-c14ac1dd0c0a',
      start_date: new Date(),
      end_date: new Date(),
      status: 'created',
      details: [
        {
          product_id: 'c625252f-1af4-4164-a8db-f80c499a70d1',
          quantity: 10,
          unit_price: 10,
          sale_price: 1,
        },
        {
          product_id: 'c625252f-1af4-4164-a8db-f80c499a70d1',
          quantity: 10,
          unit_price: 10,
          sale_price: 1,
        },
      ],
    });

    const updatedOffer = await updateWeeklyOffer.execute({
      offer_id: createdOffer.weekly_offer.id,
      start_date: createdOffer.weekly_offer.start_date,
      end_date: createdOffer.weekly_offer.end_date,
      status: 'created',
      details: [
        {
          id: createdOffer.weekly_offer_details[1].id,
          quantity: 20,
          unit_price: 20,
          sale_price: 20,
        },
      ],
    });

    expect(updatedOffer.weekly_offer_details[1].quantity).toBe(10);
    expect(updatedOffer.weekly_offer_details[0].quantity).toBe(20);
  });

  it('should not be able to update a weekly offer with non-existing offer id', async () => {
    await expect(
      updateWeeklyOffer.execute({
        offer_id: 'non-existing offer id',
        start_date: new Date(),
        end_date: new Date(),
        status: 'unavailable',
        details: [
          {
            id: '1',
            quantity: 11,
            unit_price: 11,
            sale_price: 2,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
