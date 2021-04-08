import AppError from '@shared/errors/AppError';
import FakeWeeklyOffersRepository from '../repositories/fakes/FakeWeeklyOffersRepository';
import FakeWeeklyOfferDetailsRepository from '../repositories/fakes/FakeWeeklyOffersDetailsRepository';
import CreateWeeklyOfferService from './CreateWeeklyOffersService';
import DeleteWeeklyOfferService from './DeleteWeeklyOffersService';

let fakeWeeklyOffersRepository: FakeWeeklyOffersRepository;
let fakeWeeklyOfferDetailsRepository: FakeWeeklyOfferDetailsRepository;
let createWeeklyOffer: CreateWeeklyOfferService;
let deleteWeeklyOffer: DeleteWeeklyOfferService;

describe('DeleteWeeklyOffer', () => {
  beforeEach(() => {
    fakeWeeklyOffersRepository = new FakeWeeklyOffersRepository();
    fakeWeeklyOfferDetailsRepository = new FakeWeeklyOfferDetailsRepository();

    createWeeklyOffer = new CreateWeeklyOfferService(
      fakeWeeklyOffersRepository,
      fakeWeeklyOfferDetailsRepository,
    );

    deleteWeeklyOffer = new DeleteWeeklyOfferService(
      fakeWeeklyOffersRepository,
      fakeWeeklyOfferDetailsRepository,
    );
  });

  it('should be able to delete a weekly offer', async () => {
    const offer = await createWeeklyOffer.execute({
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

    const message = await deleteWeeklyOffer.execute({
      offer_id: offer.weekly_offer.id,
    });

    expect(message).toHaveProperty('message');
  });

  it('should not be able to delete the weekly offer if the given id does not exist', async () => {
    await expect(
      deleteWeeklyOffer.execute({ offer_id: 'non-existing-point-id' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
