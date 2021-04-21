import { v4 as uuid } from 'uuid';

import IPaginationDTO from '@shared/dtos/IPaginationDTO';
import { isWithinInterval } from 'date-fns';
import IFindAllListsInPeriod from '@modules/lists/dtos/IFindAllListsInPeriod';
import ICreateListDTO from '@modules/lists/dtos/ICreateListDTO';
import IPaginatedListsDTO from '@modules/lists/dtos/IPaginatedListsDTO';
import List from '../../infra/typeorm/entities/List';
import IListsReposiroty from '../IListsReposiroty';

class FakeListsReposiroty implements IListsReposiroty {
  private lists: List[] = [];

  public async findById(id: string): Promise<List | undefined> {
    const foundList = this.lists.find(list => list.id === id);

    return foundList;
  }

  public async findByUserId(user_id: string): Promise<List[] | undefined> {
    const foundLists = this.lists.filter(list => list.user_id === user_id);

    return foundLists;
  }

  public async findByPeriod({
    start_date,
    end_date = new Date(),
  }: IFindAllListsInPeriod): Promise<List[] | undefined> {
    const foundLists = this.lists.filter(
      list =>
        list.start_date.getTime() >= start_date.getTime() &&
        list.start_date.getTime() <= end_date.getTime(),
    );

    return foundLists;
  }

  public async create({ user_id, start_date }: ICreateListDTO): Promise<List> {
    const list = new List();

    Object.assign(list, { id: uuid() }, { user_id, start_date });

    this.lists.push(list);

    return list;
  }

  public async delete(id: string): Promise<void> {
    this.lists.filter(list => list.id !== id);
  }

  public async save(list: List): Promise<List> {
    const findIndex = this.lists.findIndex(
      foundList => foundList.id === list.id,
    );

    this.lists[findIndex] = list;

    return list;
  }

  public async findAllPaginated(
    { page, limit }: IPaginationDTO,
    user_id: string,
  ): Promise<IPaginatedListsDTO> {
    const skipped_items = (page - 1) * limit;

    const total_count = this.lists.length;
    const lists: List[] = [];

    let i = skipped_items;

    const limitLoop =
      skipped_items + limit < total_count
        ? skipped_items + limit
        : total_count - 1;

    if (i === 0 && limitLoop === 0 && this.lists[0]) {
      lists.push(this.lists[0]);
    }
    // eslint-disable-next-line no-plusplus
    for (i; i < limitLoop; i++) {
      lists.push(this.lists[i]);
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
  ): Promise<IPaginatedListsDTO> {
    const skipped_items = (page - 1) * limit;
    const arrayLists = this.lists.filter(({ start_date, end_date }) =>
      isWithinInterval(date, { start: start_date, end: end_date }),
    );
    const total_count = arrayLists.length;
    const lists: List[] = [];

    let i = skipped_items;

    const limitLoop =
      skipped_items + limit < total_count
        ? skipped_items + limit
        : total_count - 1;

    if (i === 0 && limitLoop === 0 && arrayLists) {
      lists.push(this.lists[0]);
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

export default FakeListsReposiroty;
