import { getRepository, Repository, Between } from 'typeorm';

import ICreateListDTO from '@modules/lists/dtos/ICreateListDTO';
import IFindAllListsInPeriod from '@modules/lists/dtos/IFindAllListsInPeriod';
import List from '@modules/lists/infra/typeorm/entities/List';
import IPaginationDTO from '@shared/dtos/IPaginationDTO';
import { AfterDate, BeforeDate } from '@shared/utils/typeorm';
import IListsReposiroty from '@modules/lists/repositories/IListsReposiroty';
import IPaginatedListsDTO from '@modules/lists/dtos/IPaginatedListsDTO';

class ListsRepository implements IListsReposiroty {
  private ormRepository: Repository<List>;

  constructor() {
    this.ormRepository = getRepository(List);
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
  }: ICreateListDTO): Promise<List> {
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

  public async save(list: List): Promise<List> {
    await this.ormRepository.save(list);

    return list;
  }

  public async findAllPaginated(
    { page, limit }: IPaginationDTO,
    user_id?: string,
  ): Promise<IPaginatedListsDTO> {
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
  ): Promise<IPaginatedListsDTO> {
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

export default ListsRepository;
