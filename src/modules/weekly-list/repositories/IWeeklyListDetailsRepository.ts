import WeeklyListDetail from '../infra/typeorm/entities/WeeklyListDetail';
import ICreateWeeklyListDetailDTO from '../dtos/ICreateWeeklyListDetailDTO';

export default interface IWeeklyListReposiroty {
  findById(id: string): Promise<WeeklyListDetail | undefined>;
  create(data: ICreateWeeklyListDetailDTO): Promise<WeeklyListDetail>;
  delete(id: string): Promise<void>;
  save(weeklyListDetail: WeeklyListDetail): Promise<WeeklyListDetail>;
}
