import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IWeeklyListsReposiroty from '../repositories/IWeeklyListsReposiroty';
import IWeeklyListDetailsRepository from '../repositories/IWeeklyListDetailsRepository';
import WeeklyList from '../infra/typeorm/entities/WeeklyList';
import WeeklyListDetail from '../infra/typeorm/entities/WeeklyListDetail';
import ICreateWeeklyListDTO from '../dtos/ICreateWeeklyListDTO';

interface IRequest extends Omit<ICreateWeeklyListDTO, 'user_id'> {
  list_id: string;
  details: [
    {
      id: string;
      due_date: Date;
      lot: string;
      quantity: number;
      unit_price: number;
      discount: number;
      total_price: number;
    },
  ];
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

    if (listDetails) {
      details.forEach(detail => {
        const detailIndex = listDetails.findIndex(() => detail.id);

        if (detailIndex !== -1) {
          listDetails[detailIndex].due_date = detail.due_date;
          listDetails[detailIndex].lot = detail.lot;
          listDetails[detailIndex].quantity = detail.quantity;
          listDetails[detailIndex].unit_price = detail.unit_price;
          listDetails[detailIndex].unit_price = detail.unit_price;
          listDetails[detailIndex].discount = detail.discount;
          listDetails[detailIndex].total_price = detail.total_price;
        }
      });
      await this.weeklyListDetailsRepository.save(listDetails);
    }

    return {
      weekly_list: list,
      weekly_list_details: listDetails as WeeklyListDetail[],
    };
  }
}

export default UpdateWeeklyListService;
