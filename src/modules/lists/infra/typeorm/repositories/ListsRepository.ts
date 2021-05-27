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
import IPaginationListsDTO from '@modules/lists/dtos/IPaginationListsDTO';
import { mountQueryWhere } from '@shared/utils/helpers';
import ListProducersDetail from '../entities/ListProducersDetail';
import ListOffersDetail from '../entities/ListOffersDetail';

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

  public async findAllPaginated({
    limit,
    page,
    order,
    sort_by,
    type,
    ...filter
  }: IPaginationListsDTO): Promise<IPaginatedListsDTO> {
    const skipped_items = (page - 1) * limit;

    const relation = type === 'offer' ? ListOffersDetail : ListProducersDetail;
   
    const queryWhere = mountQueryWhere(filter, 'l');

    const total_count = await this.ormRepository.count();

    const lists = await this.ormRepository
      .createQueryBuilder('l')
      .select('l.*')
      .where(queryWhere)
      .addSelect('json_agg(lod) as "details"')
      .orderBy(`l.${sort_by || 'created_at'}`, order)
      .leftJoin(relation, 'lod', 'l.id = lod.list_id')
      .groupBy('l.id')
      .offset(skipped_items)
      .limit(limit)
      .getRawMany<List>();

    return {
      total_count,
      page,
      limit,
      data: lists,
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
