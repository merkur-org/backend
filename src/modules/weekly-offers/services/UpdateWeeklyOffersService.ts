import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IWeeklyOffersReposiroty from '../repositories/IWeeklyOffersRepository';
import IWeeklyOffersDetailsRepository from '../repositories/IWeeklyOffersDetailsRepository';
import WeeklyOffers from '../infra/typeorm/entities/WeeklyOffers';
import WeeklyOffersDetail from '../infra/typeorm/entities/WeeklyOffersDetail';
import ICreateWeeklyOffersDTO from '../dtos/ICreateWeeklyOffersDTO';

interface IRequest extends Omit<ICreateWeeklyOffersDTO, 'user_id'> {
  offer_id: string;
  details: [
    {
      id: string;
      quantity: number;
      unit_price: number;
      sale_price: number;
    },
  ];
}

interface IResponse {
  weekly_offer: WeeklyOffers;
  weekly_offer_details: WeeklyOffersDetail[];
}

@injectable()
class UpdateWeeklyOffersService {
  constructor(
    @inject('WeeklyOffersRepository')
    private weeklyOffersRepository: IWeeklyOffersReposiroty,

    @inject('WeeklyOffersDetailsRepository')
    private weeklyOffersDetailsRepository: IWeeklyOffersDetailsRepository,
  ) {}

  public async execute({
    offer_id,
    details,
    start_date,
    status,
  }: IRequest): Promise<IResponse> {
    const offer = await this.weeklyOffersRepository.findById(offer_id);

    if (!offer) {
      throw new AppError('Weekly Offers not found', 404);
    }

    offer.start_date = start_date || offer.start_date;
    offer.status = status || offer.status;
    offer.created_at = new Date();

    await this.weeklyOffersRepository.save(offer);

    const offerDetails = await this.weeklyOffersDetailsRepository.findByListsId(
      offer_id,
    );

    if (offerDetails) {
      details.forEach(detail => {
        const detailIndex = offerDetails.findIndex(() => detail.id);

        if (detailIndex !== -1) {
          offerDetails[detailIndex].quantity = detail.quantity;
          offerDetails[detailIndex].unit_price = detail.unit_price;
          offerDetails[detailIndex].unit_price = detail.unit_price;
          offerDetails[detailIndex].sale_price = detail.sale_price;
          offerDetails[detailIndex].updated_at = new Date();
        }
      });
      await this.weeklyOffersDetailsRepository.save(offerDetails);
    }

    return {
      weekly_offer: offer,
      weekly_offer_details: offerDetails as WeeklyOffersDetail[],
    };
  }
}

export default UpdateWeeklyOffersService;
