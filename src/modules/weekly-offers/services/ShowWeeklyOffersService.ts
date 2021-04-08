import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IWeeklyOffersRepository from '../repositories/IWeeklyOffersRepository';
import IWeeklyOffersDetailsRepository from '../repositories/IWeeklyOffersDetailsRepository';
import WeeklyOffers from '../infra/typeorm/entities/WeeklyOffers';
import WeeklyOffersDetail from '../infra/typeorm/entities/WeeklyOffersDetail';

interface IRequest {
  offer_id: string;
}

interface IResponse {
  weekly_offer: WeeklyOffers;
  weekly_offer_details: WeeklyOffersDetail[];
}

@injectable()
class ShowWeeklyOfferSerice {
  constructor(
    @inject('WeeklyOffersRepository')
    private weeklyOffersRepository: IWeeklyOffersRepository,

    @inject('WeeklyOffersDetailsRepository')
    private weeklyOffersDetailsRepository: IWeeklyOffersDetailsRepository,
  ) {}

  public async execute({ offer_id }: IRequest): Promise<IResponse> {
    const weeklyOffers = await this.weeklyOffersRepository.findById(offer_id);

    const offerDetails = await this.weeklyOffersDetailsRepository.findByListsId(
      offer_id,
    );

    if (!weeklyOffers) {
      throw new AppError('Weekly Offers not found', 404);
    }

    return {
      weekly_offer: weeklyOffers,
      weekly_offer_details: offerDetails as WeeklyOffersDetail[],
    };
  }
}

export default ShowWeeklyOfferSerice;
