import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IWeeklyOffersReposiroty from '../repositories/IWeeklyOffersRepository';
import IWeeklyOffersDetailsRepository from '../repositories/IWeeklyOffersDetailsRepository';

interface IRequest {
  offer_id: string;
}

@injectable()
class DeleteWeeklyOffersService {
  constructor(
    @inject('WeeklyOffersRepository')
    private weeklyOffersRepository: IWeeklyOffersReposiroty,

    @inject('WeeklyOffersDetailsRepository')
    private weeklyOffersDetailsRepository: IWeeklyOffersDetailsRepository,
  ) {}

  public async execute({ offer_id }: IRequest): Promise<{ message: string }> {
    const removedDetails = await this.weeklyOffersDetailsRepository.findByListsId(
      offer_id,
    );

    if (removedDetails) {
      await Promise.all(
        removedDetails.map(async detail => {
          await this.weeklyOffersDetailsRepository.delete(detail.id);
        }),
      );
    }

    const offer = await this.weeklyOffersRepository.findById(offer_id);

    if (!offer) {
      throw new AppError('Weekly Offers not found', 404);
    }

    await this.weeklyOffersRepository.delete(offer_id);
    await this.weeklyOffersRepository.delete(offer_id);

    return { message: 'weekly offer point deleted' };
  }
}

export default DeleteWeeklyOffersService;
