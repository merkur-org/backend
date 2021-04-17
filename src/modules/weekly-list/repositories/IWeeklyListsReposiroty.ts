import ICreateWeeklyListDTO from '@modules/weekly-list/dtos/ICreateWeeklyListDTO';
import IFindAllListsInPeriod from '@modules/weekly-list/dtos/IFindAllListsInPeriod';
import IPaginationDTO from '@shared/dtos/IPaginationDTO';
import PaginatedWeeklyListsDTO from '@modules/weekly-list/dtos/PaginatedWeeklyListsDTO';
import WeeklyList from '../infra/typeorm/entities/WeeklyList';

export default interface IWeeklyListReposiroty {
  findById(id: string): Promise<WeeklyList | undefined>;
  findByUserId(user_id: string): Promise<WeeklyList[] | undefined>;
  findByPeriod(
    period: IFindAllListsInPeriod,
  ): Promise<WeeklyList[] | undefined>;
  findBetweenStartAndEndDate(
    { page, limit }: IPaginationDTO,
    date: Date,
  ): Promise<PaginatedWeeklyListsDTO>;
  create(data: ICreateWeeklyListDTO): Promise<WeeklyList>;
  delete(id: string): Promise<void>;
  save(weeklyList: WeeklyList): Promise<WeeklyList>;
  findAllPaginated(
    { page, limit }: IPaginationDTO,
    user_id?: string,
  ): Promise<PaginatedWeeklyListsDTO>;
}
