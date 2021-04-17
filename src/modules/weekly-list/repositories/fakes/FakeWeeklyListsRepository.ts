import { v4 as uuid } from 'uuid';

import IWeeklyListReposiroty from '@modules/weekly-list/repositories/IWeeklyListsReposiroty';
import ICreateWeeklyListDTO from '@modules/weekly-list/dtos/ICreateWeeklyListDTO';
import IFindAllListsInPeriod from '@modules/weekly-list/dtos/IFindAllListsInPeriod';

import PaginatedWeeklyListsDTO from '@modules/weekly-list/dtos/PaginatedWeeklyListsDTO';
import IPaginationDTO from '@shared/dtos/IPaginationDTO';
import { isWithinInterval } from 'date-fns';
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
    { page, limit }: IPaginationDTO,
    user_id: string,
  ): Promise<PaginatedWeeklyListsDTO> {
    const skipped_items = (page - 1) * limit;

    const total_count = this.weeklyLists.length;
    const lists: WeeklyList[] = [];

    let i = skipped_items;

    const limitLoop =
      skipped_items + limit < total_count
        ? skipped_items + limit
        : total_count - 1;

    if (i === 0 && limitLoop === 0 && this.weeklyLists[0]) {
      lists.push(this.weeklyLists[0]);
    }
    // eslint-disable-next-line no-plusplus
    for (i; i < limitLoop; i++) {
      lists.push(this.weeklyLists[i]);
    }

    return {
      total_count,
      page,
      limit,
      data: lists,
    };
  }

  public async findBetweenStartAndEndDate(
    { page, limit }: IPaginationDTO,
    date: Date,
  ): Promise<PaginatedWeeklyListsDTO> {
    const skipped_items = (page - 1) * limit;
    const arrayLists = this.weeklyLists.filter(({ start_date, end_date }) =>
      isWithinInterval(date, { start: start_date, end: end_date }),
    );
    const total_count = arrayLists.length;
    const lists: WeeklyList[] = [];

    let i = skipped_items;

    const limitLoop =
      skipped_items + limit < total_count
        ? skipped_items + limit
        : total_count - 1;

    if (i === 0 && limitLoop === 0 && arrayLists) {
      lists.push(this.weeklyLists[0]);
    }
    // eslint-disable-next-line no-plusplus
    for (i; i < limitLoop; i++) {
      lists.push(arrayLists[i]);
    }

    return {
      total_count,
      page,
      limit,
      data: lists,
    };
  }
}

export default FakeWeeklyListRepository;
