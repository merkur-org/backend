import { uuid } from 'uuidv4';

import IWeeklyListReposiroty from '@modules/weekly-list/repositories/IWeeklyListsReposiroty';
import ICreateWeeklyListDTO from '@modules/weekly-list/dtos/ICreateWeeklyListDTO';
import IFindAllListsInPeriod from '@modules/weekly-list/dtos/IFindAllListsInPeriod';

import PaginatedWeeklyListsDTO from '@modules/weekly-list/dtos/PaginatedWeeklyListsDTO';
import IPaginationDTO from '@shared/dtos/IPaginationDTO';
import WeeklyList from '../../infra/typeorm/entities/WeeklyList';

class FakeWeeklyListRepository implements IWeeklyListReposiroty {
  private weeklyLists: WeeklyList[] = [];

  public async findById(id: string): Promise<WeeklyList | undefined> {
    const foundList = this.weeklyLists.find(list => list.id === id);

    return foundList;
  }

  public async findByUserId(
    user_id: string,
  ): Promise<WeeklyList[] | undefined> {
    const foundLists = this.weeklyLists.filter(
      list => list.user_id === user_id,
    );

    return foundLists;
  }

  public async findByPeriod({
    start_date,
    end_date = new Date(),
  }: IFindAllListsInPeriod): Promise<WeeklyList[] | undefined> {
    const foundLists = this.weeklyLists.filter(
      list =>
        list.start_date.getTime() >= start_date.getTime() &&
        list.start_date.getTime() <= end_date.getTime(),
    );

    return foundLists;
  }

  public async create({
    user_id,
    start_date,
  }: ICreateWeeklyListDTO): Promise<WeeklyList> {
    const list = new WeeklyList();

    Object.assign(list, { id: uuid() }, { user_id, start_date });

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

  public async findAllPaginated(
    user_id: string,
    { page, limit }: IPaginationDTO,
  ): Promise<PaginatedWeeklyListsDTO> {
    const skippedItems = (page - 1) * limit;

    const totalCount = this.weeklyLists.length;
    const lists: WeeklyList[] = [];

    let i = skippedItems;

    const limitLoop =
      skippedItems + limit < totalCount ? skippedItems + limit : totalCount - 1;

    if (i === 0 && limitLoop === 0 && this.weeklyLists[0]) {
      lists.push(this.weeklyLists[0]);
    }
    // eslint-disable-next-line no-plusplus
    for (i; i < limitLoop; i++) {
      lists.push(this.weeklyLists[i]);
    }

    return {
      totalCount,
      page,
      limit,
      data: lists,
    };
  }
}

export default FakeWeeklyListRepository;
