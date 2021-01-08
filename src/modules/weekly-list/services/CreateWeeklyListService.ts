import { injectable, inject } from 'tsyringe';
import ICreateWeeklyListDetailDTO from '../dtos/ICreateWeeklyListDetailDTO';
import WeeklyListDetail from '../infra/typeorm/entities/WeeklyListDetail';
import IWeeklyListsReposiroty from '../repositories/IWeeklyListsReposiroty';
import IWeeklyListDetailsRepository from '../repositories/IWeeklyListDetailsRepository';

@injectable()
class CreateDeliveryPointService {
  constructor(
    @inject('WeeklyListRepository')
    private weeklyListRepository: IWeeklyListsReposiroty,

    @inject('WeeklyListDetailRepository')
    private weeklyListDetailRepository: IWeeklyListDetailsRepository,
  ) {}

  public async execute({
    products,
  }: ICreateWeeklyListDetailDTO): Promise<WeeklyListDetail> {
    const weeklyList = await this.weeklyListRepository.create();

    const weeklyListDetail = await this.weeklyListDetailRepository.create({
      weekly_list: weeklyList,
      products,
      total_price: products.reduce((a, b) => a + b.sale_price, 0),
    });

    return weeklyListDetail;
  }
}

export default CreateDeliveryPointService;
