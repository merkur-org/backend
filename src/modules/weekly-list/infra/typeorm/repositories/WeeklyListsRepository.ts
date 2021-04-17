import { getRepository, Repository, Between } from 'typeorm';

import IWeeklyListReposiroty from '@modules/weekly-list/repositories/IWeeklyListsReposiroty';
import ICreateWeeklyListDTO from '@modules/weekly-list/dtos/ICreateWeeklyListDTO';
import IFindAllListsInPeriod from '@modules/weekly-list/dtos/IFindAllListsInPeriod';
import WeeklyList from '@modules/weekly-list/infra/typeorm/entities/WeeklyList';
import IPaginationDTO from '@shared/dtos/IPaginationDTO';
import PaginatedWeeklyListsDTO from '@modules/weekly-list/dtos/PaginatedWeeklyListsDTO';
import { AfterDate, BeforeDate } from '@shared/utils/typeorm';

class WeeklyListRepository implements IWeeklyListReposiroty {
  private ormRepository: Repository<WeeklyList>;

  constructor() {
    this.ormRepository = getRepository(WeeklyList);
  }

  public async findById(id: string): Promise<WeeklyList | undefined> {
    const foundList = await this.ormRepository.findOne(id);

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
    end_date,
    status,
  }: ICreateWeeklyListDTO): Promise<WeeklyList> {
    const list = this.ormRepository.create({
      user_id,
      start_date,
      end_date,
      status,
    });
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
    { page, limit }: IPaginationDTO,
    user_id?: string,
  ): Promise<PaginatedWeeklyListsDTO> {
    const skipped_items = (page - 1) * limit;

    // const [offers, total_count] = await this.ormRepository
    //   .createQueryBuilder('wo')
    //   .select('wo.*')
    //   .addSelect('json_agg(wod) as "details"')
    //   .orderBy('wo.created_at', 'DESC')
    //   .leftJoin(WeeklyOffersDetail, 'wod', 'wo.id = wod.offer_id')
    //   .where(user_id ? `wo.user_id = ${user_id}` : '')
    //   .groupBy('wo.id')
    //   .offset(skipped_items)
    //   .limit(limit)
    //   .getManyAndCount();
    const [offers, total_count] = await this.ormRepository.findAndCount({
      where: user_id ? { user_id } : '',
      relations: ['details'],
      skip: skipped_items,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return {
      total_count,
      page,
      limit,
      data: offers,
    };
  }

  public async findBetweenStartAndEndDate(
    { page, limit }: IPaginationDTO,
    date = new Date(),
  ): Promise<PaginatedWeeklyListsDTO> {
    const skipped_items = (page - 1) * limit;

    const [offers, total_count] = await this.ormRepository.findAndCount({
      where: {
        start_date: BeforeDate(date),
        end_date: AfterDate(date),
      },
      relations: ['details'],
      skip: skipped_items,
      take: limit,
    });

    return {
      total_count,
      page,
      limit,
      data: offers,
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
