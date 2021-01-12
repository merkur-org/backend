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
  create(data: ICreateWeeklyListDTO): Promise<WeeklyList>;
  delete(id: string): Promise<void>;
  save(weeklyList: WeeklyList): Promise<WeeklyList>;
  findAllPaginated(
    user_id: string,
    { page, limit }: IPaginationDTO,
  ): Promise<PaginatedWeeklyListsDTO>;
}
