import { injectable, inject } from 'tsyringe';
import ICreateWeeklyOffersDetailDTO from '../dtos/ICreateWeeklyOffersDetailDTO';
import ICreateWeeklyOffersDTO from '../dtos/ICreateWeeklyOffersDTO';
import WeeklyOffersDetail from '../infra/typeorm/entities/WeeklyOffersDetail';
import IWeeklyOffersReposiroty from '../repositories/IWeeklyOffersRepository';
import IWeeklyOffersDetailsRepository from '../repositories/IWeeklyOffersDetailsRepository';
import WeeklyOffers from '../infra/typeorm/entities/WeeklyOffers';

interface IRequest extends ICreateWeeklyOffersDTO {
  details: Omit<ICreateWeeklyOffersDetailDTO, 'offer_id'>[];
}

interface IResponse {
  weekly_offer: WeeklyOffers;
  weekly_offer_details: WeeklyOffersDetail[];
}
@injectable()
class CreateDeliveryPointService {
  constructor(
    @inject('WeeklyOffersRepository')
    private weeklyOffersRepository: IWeeklyOffersReposiroty,

    @inject('WeeklyOffersDetailsRepository')
    private weeklyOffersDetailsRepository: IWeeklyOffersDetailsRepository,
  ) {}

  public async execute({
    details,
    start_date,
    end_date,
    user_id,
    status,
  }: IRequest): Promise<IResponse> {
    const weeklyOffers = await this.weeklyOffersRepository.create({
      start_date,
      end_date,
      user_id,
      status,
    });

    const serializedProducts = details.map(detail => {
      return {
        ...detail,
        offer_id: weeklyOffers.id,
      };
    });

    const weeklyOffersDetails = await this.weeklyOffersDetailsRepository.create(
      serializedProducts,
    );

    return {
      weekly_offer: weeklyOffers,
      weekly_offer_details: weeklyOffersDetails,
    };
  }
}

export default CreateDeliveryPointService;
