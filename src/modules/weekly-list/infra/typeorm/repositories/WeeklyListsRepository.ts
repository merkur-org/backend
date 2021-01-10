import { getRepository, Repository, Between } from 'typeorm';

import IWeeklyListReposiroty from '@modules/weekly-list/repositories/IWeeklyListsReposiroty';
import ICreateWeeklyListDTO from '@modules/weekly-list/dtos/ICreateWeeklyListDTO';
import IFindAllListsInPeriod from '@modules/weekly-list/dtos/IFindAllListsInPeriod';
import WeeklyList from '@modules/weekly-list/infra/typeorm/entities/WeeklyList';
import PaginationDTO from '@shared/dtos/PaginationDTO';
import PaginatedWeeklyListsDTO from '@modules/weekly-list/dtos/PaginatedWeeklyListsDTO';

class WeeklyListRepository implements IWeeklyListReposiroty {
  private ormRepository: Repository<WeeklyList>;

  constructor() {
    this.ormRepository = getRepository(WeeklyList);
  }

  public async findById(id: string): Promise<WeeklyList | undefined> {
    const foundList = this.ormRepository.findOne(id);

    return foundList;
  }

  public async findByUserId(
    user_id: string,
  ): Promise<WeeklyList[] | undefined> {
    const foundLists = this.ormRepository.find({ where: { user_id } });

    return foundLists;
  }

  public async findByPeriod({
    start_date,
    end_date = new Date(),
  }: IFindAllListsInPeriod): Promise<WeeklyList[] | undefined> {
    const foundLists = this.ormRepository.find({
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
    this.ormRepository.delete({ id });
  }

  public async save(weeklyList: WeeklyList): Promise<WeeklyList> {
    await this.ormRepository.save(weeklyList);

    return weeklyList;
  }

  public async findAllPaginated({
    page,
    limit,
  }: PaginationDTO): Promise<PaginatedWeeklyListsDTO> {
    const skippedItems = (page - 1) * limit;

    const totalCount = await this.ormRepository.count();
    const lists = await this.ormRepository
      .createQueryBuilder('weekly_list')
      .orderBy('created_at', 'DESC')
      .offset(skippedItems)
      .limit(limit)
      .getMany();

    return {
      totalCount,
      page,
      limit,
      data: lists,
    };
  }
}

export default WeeklyListRepository;
