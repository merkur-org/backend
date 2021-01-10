import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IWeeklyListsReposiroty from '../repositories/IWeeklyListsReposiroty';
import IWeeklyListDetailsRepository from '../repositories/IWeeklyListDetailsRepository';
import WeeklyList from '../infra/typeorm/entities/WeeklyList';
import WeeklyListDetail from '../infra/typeorm/entities/WeeklyListDetail';

interface IRequest {
  list_id: string;
}

interface IResponse {
  weekly_list: WeeklyList;
  weekly_list_details: WeeklyListDetail[];
}

@injectable()
class ShowWeeklyListSerice {
  constructor(
    @inject('WeeklyListsRepository')
    private weeklyListsRepository: IWeeklyListsReposiroty,

    @inject('WeeklyListDetailsRepository')
    private weeklyListDetailsRepository: IWeeklyListDetailsRepository,
  ) {}

  public async execute({ list_id }: IRequest): Promise<IResponse> {
    const weeklyList = await this.weeklyListsRepository.findById(list_id);

    const listDetails = await this.weeklyListDetailsRepository.findByListId(
      list_id,
    );

    if (!weeklyList) {
      throw new AppError('Weekly List not found', 404);
    }

    return {
      weekly_list: weeklyList,
      weekly_list_details: listDetails as WeeklyListDetail[],
    };
  }
}

export default ShowWeeklyListSerice;
