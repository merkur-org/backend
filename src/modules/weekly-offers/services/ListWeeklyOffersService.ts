import { injectable, inject } from 'tsyringe';

import IPaginationDTO from '@shared/dtos/IPaginationDTO';
import AppError from '@shared/errors/AppError';
import IWeeklyOffersDetailsRepository from '../repositories/IWeeklyOffersDetailsRepository';
import IWeeklyOffersReposiroty from '../repositories/IWeeklyOffersRepository';
import PaginatedWeeklyOffersDTO from '../dtos/PaginatedWeeklyOffersDTO';

interface IRequest extends IPaginationDTO {
  user_id: string;
}

@injectable()
class OffersWeeklyOffersService {
  constructor(
    @inject('WeeklyOffersRepository')
    private weeklyOffersRepository: IWeeklyOffersReposiroty,

    @inject('WeeklyOffersDetailsRepository')
    private weeklyOffersDetailsRepository: IWeeklyOffersDetailsRepository,
  ) {}

  public async execute({
    user_id,
    limit,
    page,
  }: IRequest): Promise<PaginatedWeeklyOffersDTO> {
    const foundUser = await this.weeklyOffersRepository.findByUserId(user_id);

    if (foundUser?.length === 0) {
      throw new AppError('User not found', 404);
    }

    const response = await this.weeklyOffersRepository.findAllPaginated(
      user_id,
      { limit, page },
    );

    return response;
  }
}

export default OffersWeeklyOffersService;
