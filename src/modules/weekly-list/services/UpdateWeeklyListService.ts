import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IWeeklyListsReposiroty from '../repositories/IWeeklyListsReposiroty';
import IWeeklyListDetailsRepository from '../repositories/IWeeklyListDetailsRepository';
import WeeklyList from '../infra/typeorm/entities/WeeklyList';
import WeeklyListDetail from '../infra/typeorm/entities/WeeklyListDetail';
import ICreateWeeklyListDTO from '../dtos/ICreateWeeklyListDTO';

interface IRequest extends Omit<ICreateWeeklyListDTO, 'user_id'> {
  list_id: string;
  details: WeeklyListDetail[];
}

interface IResponse {
  weekly_list: WeeklyList;
  weekly_list_details: WeeklyListDetail[];
}

@injectable()
class UpdateWeeklyListService {
  constructor(
    @inject('WeeklyListsRepository')
    private weeklyListsRepository: IWeeklyListsReposiroty,

    @inject('WeeklyListDetailsRepository')
    private weeklyListDetailsRepository: IWeeklyListDetailsRepository,
  ) {}

  public async execute({
    list_id,
    details,
    start_date,
    status,
  }: IRequest): Promise<IResponse> {
    const list = await this.weeklyListsRepository.findById(list_id);

    if (!list) {
      throw new AppError('Weekly List not found', 404);
    }

    list.start_date = start_date;
    list.status = status;
    await this.weeklyListsRepository.save(list);

    const listDetails = await this.weeklyListDetailsRepository.findByListId(
      list_id,
    );

    let serializedDetails;
    if (listDetails) {
      serializedDetails = details.map(detail => {
        return {
          ...detail,
          list_id,
        };
      });
      await this.weeklyListDetailsRepository.save(serializedDetails);
    }

    return {
      weekly_list: list,
      weekly_list_details: serializedDetails as WeeklyListDetail[],
    };
  }
}

export default UpdateWeeklyListService;
