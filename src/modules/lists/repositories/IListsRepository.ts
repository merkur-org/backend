import ICreateListDTO from '@modules/lists/dtos/ICreateListDTO';
import IFindAllListsInPeriod from '@modules/lists/dtos/IFindAllListsInPeriod';
import IPaginationDTO from '@shared/dtos/IPaginationDTO';
import IPaginatedListsDTO from '@modules/lists/dtos/IPaginatedListsDTO';
import List, { TList } from '../infra/typeorm/entities/List';
import IPaginationListsDTO from '../dtos/IPaginationListsDTO';

export default interface IListsRepository {
  findById(id: string): Promise<List | undefined>;
  findByUserId(user_id: string): Promise<List[] | undefined>;
  findByPeriod(period: IFindAllListsInPeriod): Promise<List[] | undefined>;
  findBetweenStartAndEndDate(
    { page, limit }: IPaginationDTO,
    type: TList,
    start_date: Date,
    end_date: Date,
  ): Promise<IPaginatedListsDTO>;
  create(data: ICreateListDTO): Promise<List>;
  delete(id: string): Promise<void>;
  save(list: List): Promise<List>;
  findAllPaginated(data: IPaginationListsDTO): Promise<IPaginatedListsDTO>;
}
