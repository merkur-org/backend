import { getRepository, Repository, Between } from 'typeorm';

import IWeeklyListReposiroty from '@modules/weekly-list/repositories/IWeeklyListsReposiroty';
import ICreateWeeklyListDTO from '@modules/weekly-list/dtos/ICreateWeeklyListDTO';
import IFindAllListsInPeriod from '@modules/weekly-list/dtos/IFindAllListsInPeriod';

import WeeklyList from '@modules/weekly-list/infra/typeorm/entities/WeeklyList';

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
  }: ICreateWeeklyListDTO): Promise<WeeklyList> {
    const list = this.ormRepository.create({ user_id, start_date });
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
}

export default WeeklyListRepository;
