import { injectable, inject } from 'tsyringe';

import PaginationDTO from '@shared/dtos/PaginationDTO';
import IWeeklyListDetailsRepository from '../repositories/IWeeklyListDetailsRepository';
import IWeeklyListsReposiroty from '../repositories/IWeeklyListsReposiroty';
import PaginatedWeeklyListsDTO from '../dtos/PaginatedWeeklyListsDTO';

@injectable()
class ListWeeklyListsService {
  constructor(
    @inject('WeeklyListsRepository')
    private weeklyListsRepository: IWeeklyListsReposiroty,

    @inject('WeeklyListDetailsRepository')
    private weeklyListDetailsRepository: IWeeklyListDetailsRepository,
  ) {}

  public async execute({
    limit,
    page,
  }: PaginationDTO): Promise<PaginatedWeeklyListsDTO> {
    const response = await this.weeklyListsRepository.findAllPaginated({
      limit,
      page,
    });

    return response;
  }
}

export default ListWeeklyListsService;
