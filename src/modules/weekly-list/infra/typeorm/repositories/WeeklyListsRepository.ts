import { getRepository, Repository } from 'typeorm';

import IWeeklyListReposiroty from '@modules/weekly-list/repositories/IWeeklyListsReposiroty';

import WeeklyList from '../entities/WeeklyList';

class FakeWeeklyListRepository implements IWeeklyListReposiroty {
  private ormRepository: Repository<WeeklyList>;

  constructor() {
    this.ormRepository = getRepository(WeeklyList);
  }

  public async findById(id: string): Promise<WeeklyList | undefined> {
    const foundList = this.ormRepository.findOne(id);

    return foundList;
  }

  public async create(): Promise<WeeklyList> {
    const list = this.ormRepository.create();

    await this.ormRepository.save(list);

    return list;
  }

  public async delete(id: string): Promise<void> {
    this.ormRepository.delete({ id });
  }

  public async save(weeklyList: WeeklyList): Promise<WeeklyList> {
    return this.ormRepository.save(weeklyList);
  }
}

export default FakeWeeklyListRepository;
