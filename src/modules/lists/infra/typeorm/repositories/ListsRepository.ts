import {
  getRepository,
  Repository,
  Between,
  EntityManager,
  getManager,
} from 'typeorm';

import ICreateListDTO from '@modules/lists/dtos/ICreateListDTO';
import IFindAllListsInPeriod from '@modules/lists/dtos/IFindAllListsInPeriod';
import List, { TList } from '@modules/lists/infra/typeorm/entities/List';
import IPaginationDTO from '@shared/dtos/IPaginationDTO';
import { AfterDate, BeforeDate } from '@shared/utils/typeorm';
import IListsRepository from '@modules/lists/repositories/IListsRepository';
import IPaginatedListsDTO from '@modules/lists/dtos/IPaginatedListsDTO';

class ListsRepository implements IListsRepository {
  private ormRepository: Repository<List>;

  private manager: EntityManager;

  constructor() {
    this.ormRepository = getRepository(List);
    this.manager = getManager();
  }

  public async findById(id: string): Promise<List | undefined> {
    const foundList = await this.ormRepository.findOne(id);

    return foundList;
  }

  public async findByUserId(user_id: string): Promise<List[] | undefined> {
    const foundLists = await this.ormRepository.find({ where: { user_id } });

    return foundLists;
  }

  public async findByPeriod({
    start_date,
    end_date = new Date(),
  }: IFindAllListsInPeriod): Promise<List[] | undefined> {
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
    type,
  }: ICreateListDTO): Promise<List> {
    const list = this.ormRepository.create({
      user_id,
      start_date,
      end_date,
      status,
      type,
    });

    await this.ormRepository.save(list);

    return list;
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete({ id });
  }

  public async save(list: List): Promise<List> {
    await this.ormRepository.save(list);

    return list;
  }

  public async findAllPaginated(
    { page, limit }: IPaginationDTO,
    type: TList,
    user_id?: string,
  ): Promise<IPaginatedListsDTO> {
    const skipped_items = (page - 1) * limit;

    const relation = type === 'offer' ? 'details_offer' : 'details_producers';

    const [offers, total_count] = await this.ormRepository.findAndCount({
      where: user_id ? { user_id, type } : { type },
      relations: [relation],
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
    type: TList,
    date = new Date(),
  ): Promise<IPaginatedListsDTO> {
    const skipped_items = (page - 1) * limit;

    const relation = type === 'offer' ? 'details_offer' : 'details_producers';

    const [offers, total_count] = await this.ormRepository.findAndCount({
      where: {
        start_date: BeforeDate(date),
        end_date: AfterDate(date),
        type,
      },
      relations: [relation],
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

export default ListsRepository;
