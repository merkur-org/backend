import WeeklyList from '../infra/typeorm/entities/WeeklyList';

export default interface IWeeklyListReposiroty {
  findById(id: string): Promise<WeeklyList | undefined>;
  create(): Promise<WeeklyList>;
  delete(id: string): Promise<void>;
  save(weeklyList: WeeklyList): Promise<WeeklyList>;
}
