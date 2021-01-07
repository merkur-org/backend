import { uuid } from 'uuidv4';

import IWeeklyListReposiroty from '@modules/weekly-list/repositories/IWeeklyListsReposiroty';

import WeeklyList from '../../infra/typeorm/entities/WeeklyList';

class FakeWeeklyListRepository implements IWeeklyListReposiroty {
  private weeklyLists: WeeklyList[] = [];

  public async findById(id: string): Promise<WeeklyList | undefined> {
    const foundList = this.weeklyLists.find(list => list.id === id);

    return foundList;
  }

  public async create(): Promise<WeeklyList> {
    const list = new WeeklyList();

    Object.assign(list, { id: uuid() });

    this.weeklyLists.push(list);

    return list;
  }

  public async delete(id: string): Promise<void> {
    this.weeklyLists.filter(list => list.id !== id);
  }

  public async save(weeklyList: WeeklyList): Promise<WeeklyList> {
    const findIndex = this.weeklyLists.findIndex(
      foundList => foundList.id === weeklyList.id,
    );

    this.weeklyLists[findIndex] = weeklyList;

    return weeklyList;
  }
}

export default FakeWeeklyListRepository;
