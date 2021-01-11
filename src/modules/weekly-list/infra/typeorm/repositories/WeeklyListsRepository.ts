import { getRepository, Repository, Between } from 'typeorm';

import IWeeklyListReposiroty from '@modules/weekly-list/repositories/IWeeklyListsReposiroty';
import ICreateWeeklyListDTO from '@modules/weekly-list/dtos/ICreateWeeklyListDTO';
import IFindAllListsInPeriod from '@modules/weekly-list/dtos/IFindAllListsInPeriod';
import WeeklyList from '@modules/weekly-list/infra/typeorm/entities/WeeklyList';
import PaginationDTO from '@shared/dtos/PaginationDTO';
import PaginatedWeeklyListsDTO from '@modules/weekly-list/dtos/PaginatedWeeklyListsDTO';
import WeeklyListDetail from '../entities/WeeklyListDetail';

class WeeklyListRepository implements IWeeklyListReposiroty {
  private ormRepository: Repository<WeeklyList>;

  constructor() {
    this.ormRepository = getRepository(WeeklyList);
  }

  public async findById(id: string): Promise<WeeklyList | undefined> {
    const foundList = await this.ormRepository.findOne(id);

    console.log(foundList);

    return foundList;
  }

  public async findByUserId(
    user_id: string,
  ): Promise<WeeklyList[] | undefined> {
    const foundLists = await this.ormRepository.find({ where: { user_id } });

    return foundLists;
  }

  public async findByPeriod({
    start_date,
    end_date = new Date(),
  }: IFindAllListsInPeriod): Promise<WeeklyList[] | undefined> {
    const foundLists = await this.ormRepository.find({
      where: Between(start_date, end_date),
    });

    return foundLists;
  }

  public async create({
    user_id,
    start_date,
    status,
  }: ICreateWeeklyListDTO): Promise<WeeklyList> {
    const list = this.ormRepository.create({ user_id, start_date, status });
    await this.ormRepository.save(list);

    return list;
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete({ id });
  }

  public async save(weeklyList: WeeklyList): Promise<WeeklyList> {
    await this.ormRepository.save(weeklyList);

    return weeklyList;
  }

  public async findAllPaginated(
    user_id: string,
    { page, limit }: PaginationDTO,
  ): Promise<PaginatedWeeklyListsDTO> {
    const skippedItems = (page - 1) * limit;

    const totalCount = await this.ormRepository.count();
    const lists = await this.ormRepository
      .createQueryBuilder('wl')
      .select('wl.*')
      .addSelect('json_agg(wld) as "details"')
      .orderBy('wl.created_at', 'DESC')
      .leftJoin(WeeklyListDetail, 'wld', 'wl.id = wld.list_id')
      .where('wl.user_id = :user_id', { user_id })
      .groupBy('wl.id')
      .offset(skippedItems)
      .limit(limit)
      .getRawMany();

    return {
      totalCount,
      page,
      limit,
      data: lists,
    };
  }
}

export default WeeklyListRepository;

// select
// wl.created_at as created_at,
// wl.id as id,
// wl.start_date as start_date,
// wl.status as status,
// wl.updated_at as updated_at ,
// wl.user_id as user_id
// from weekly_list wl
// left join weekly_list_details wld ON wl.id = wld.list_id
// offset 0
