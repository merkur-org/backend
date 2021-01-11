import { injectable, inject } from 'tsyringe';

import PaginationDTO from '@shared/dtos/PaginationDTO';
import AppError from '@shared/errors/AppError';
import IWeeklyListDetailsRepository from '../repositories/IWeeklyListDetailsRepository';
import IWeeklyListsReposiroty from '../repositories/IWeeklyListsReposiroty';
import PaginatedWeeklyListsDTO from '../dtos/PaginatedWeeklyListsDTO';

interface IRequest extends PaginationDTO {
  user_id: string;
}

@injectable()
class ListWeeklyListsService {
  constructor(
    @inject('WeeklyListsRepository')
    private weeklyListsRepository: IWeeklyListsReposiroty,

    @inject('WeeklyListDetailsRepository')
    private weeklyListDetailsRepository: IWeeklyListDetailsRepository,
  ) {}

  public async execute({
    user_id,
    limit,
    page,
  }: IRequest): Promise<PaginatedWeeklyListsDTO> {
    const foundUser = await this.weeklyListsRepository.findByUserId(user_id);

    if (foundUser?.length === 0) {
      throw new AppError('User not found', 404);
    }

    const response = await this.weeklyListsRepository.findAllPaginated(
      user_id,
      { limit, page },
    );

    return response;
  }
}

export default ListWeeklyListsService;
