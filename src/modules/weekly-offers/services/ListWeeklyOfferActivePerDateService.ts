import { injectable, inject } from 'tsyringe';

import IPaginationDTO from '@shared/dtos/IPaginationDTO';
import IWeeklyOffersDetailsRepository from '../repositories/IWeeklyOffersDetailsRepository';
import IWeeklyOffersReposiroty from '../repositories/IWeeklyOffersRepository';
import PaginatedWeeklyOffersDTO from '../dtos/PaginatedWeeklyOffersDTO';

interface IRequest extends IPaginationDTO {
  date?: Date;
}

@injectable()
class ListWeeklyOfferActivePerDateService {
  constructor(
    @inject('WeeklyOffersRepository')
    private weeklyOffersRepository: IWeeklyOffersReposiroty,

    @inject('WeeklyOffersDetailsRepository')
    private weeklyOffersDetailsRepository: IWeeklyOffersDetailsRepository,
  ) {}

  public async execute({
    limit,
    page,
    date = new Date(),
  }: IRequest): Promise<PaginatedWeeklyOffersDTO> {
    const response = await this.weeklyOffersRepository.findBetweenStartAndEndDate(
      {
        limit,
        page,
      },
      date,
    );

    return response;
  }
}

export default ListWeeklyOfferActivePerDateService;
