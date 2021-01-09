import { injectable, inject } from 'tsyringe';
import ICreateWeeklyListDetailDTO from '../dtos/ICreateWeeklyListDetailDTO';
import ICreateWeeklyListDTO from '../dtos/ICreateWeeklyListDTO';
import WeeklyListDetail from '../infra/typeorm/entities/WeeklyListDetail';
import IWeeklyListsReposiroty from '../repositories/IWeeklyListsReposiroty';
import IWeeklyListDetailsRepository from '../repositories/IWeeklyListDetailsRepository';
import WeeklyList from '../infra/typeorm/entities/WeeklyList';

interface IRequest extends ICreateWeeklyListDTO {
  details: Omit<ICreateWeeklyListDetailDTO, 'list_id'>[];
}

interface IResponse {
  weekly_list: WeeklyList;
  weekly_list_details: WeeklyListDetail[];
}
@injectable()
class CreateDeliveryPointService {
  constructor(
    @inject('WeeklyListRepository')
    private weeklyListRepository: IWeeklyListsReposiroty,

    @inject('WeeklyListDetailRepository')
    private weeklyListDetailRepository: IWeeklyListDetailsRepository,
  ) {}

  public async execute({
    details,
    start_date,
    user_id,
  }: IRequest): Promise<IResponse> {
    const weeklyList = await this.weeklyListRepository.create({
      start_date,
      user_id,
    });

    const serializedProducts = details.map(detail => {
      return {
        ...detail,
        list_id: weeklyList.id,
      };
    });

    const weeklyListDetails = await this.weeklyListDetailRepository.create(
      serializedProducts,
    );

    return {
      weekly_list: weeklyList,
      weekly_list_details: weeklyListDetails,
    };
  }
}

export default CreateDeliveryPointService;
