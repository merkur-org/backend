import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IWeeklyListsReposiroty from '../repositories/IWeeklyListsReposiroty';
import IWeeklyListDetailsRepository from '../repositories/IWeeklyListDetailsRepository';

interface IRequest {
  list_id: string;
}

@injectable()
class DeleteWeeklyListService {
  constructor(
    @inject('WeeklyListsRepository')
    private weeklyListsRepository: IWeeklyListsReposiroty,

    @inject('WeeklyListDetailsRepository')
    private weeklyListDetailsRepository: IWeeklyListDetailsRepository,
  ) {}

  public async execute({ list_id }: IRequest): Promise<{ message: string }> {
    // const removedDetails = await this.weeklyListDetailsRepository.findByListId(
    //   list_id,
    // );

    // if (removedDetails) {
    //   await Promise.all(
    //     removedDetails.map(async detail => {
    //       await this.weeklyListDetailsRepository.delete(detail.id);
    //     }),
    //   );
    // }

    const list = await this.weeklyListsRepository.findById(list_id);

    if (!list) {
      throw new AppError('Weekly List not found', 404);
    }

    await this.weeklyListsRepository.delete(list.id);

    return { message: 'weekly list point deleted' };
  }
}

export default DeleteWeeklyListService;
