import { injectable, inject } from 'tsyringe';

import IPaginationDTO from '@shared/dtos/IPaginationDTO';
import PaginatedWeeklyListsDTO from '../dtos/PaginatedWeeklyListsDTO';
import IWeeklyListsReposiroty from '../repositories/IWeeklyListsReposiroty';
import IWeeklyListDetailsRepository from '../repositories/IWeeklyListDetailsRepository';

interface IRequest extends IPaginationDTO {
  date?: Date;
}

@injectable()
class ListWeeklyOfferActivePerDateService {
  constructor(
    @inject('WeeklyListsRepository')
    private weeklyListsRepository: IWeeklyListsReposiroty,

    @inject('WeeklyListDetailsRepository')
    private weeklyListDetailsRepository: IWeeklyListDetailsRepository,
  ) {}

  public async execute({
    limit,
    page,
    date = new Date(),
  }: IRequest): Promise<PaginatedWeeklyListsDTO> {
    const response = await this.weeklyListsRepository.findBetweenStartAndEndDate(
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
