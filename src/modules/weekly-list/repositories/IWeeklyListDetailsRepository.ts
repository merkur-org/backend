import WeeklyListDetail from '../infra/typeorm/entities/WeeklyListDetail';
import ICreateWeeklyListDetailDTO from '../dtos/ICreateWeeklyListDetailDTO';

export default interface IWeeklyListDetailReposiroty {
  findById(id: string): Promise<WeeklyListDetail | undefined>;
  findByListId(list_id: string): Promise<WeeklyListDetail[] | undefined>;
  create(data: ICreateWeeklyListDetailDTO[]): Promise<WeeklyListDetail[]>;
  delete(id: string): Promise<void>;
  save(weeklyListDetail: WeeklyListDetail[]): Promise<WeeklyListDetail[]>;
}
