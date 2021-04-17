import IFindAllInPeriod from '@shared/dtos/IFindAllInPeriod';
import IPaginationDTO from '@shared/dtos/IPaginationDTO';
import ICreateOrderDTO from '../dtos/ICreateOrderDTO';
import IPaginatedOrdersDTO from '../dtos/IPaginatedOrdersDTO';
import Order from '../infra/typeorm/entities/Order';

export interface IFindAllOrdersPaginated extends IPaginationDTO {
  user_id: string;
}
export default interface IOrdersRepository {
  findById(id: string): Promise<Order | undefined>;
  findAllPaginated({
    limit,
    page,
  }: IPaginationDTO): Promise<IPaginatedOrdersDTO>;
  findByUserId({
    user_id,
    page,
    limit,
  }: IFindAllOrdersPaginated): Promise<IPaginatedOrdersDTO>;
  findByPeriod(period: IFindAllInPeriod): Promise<Order[] | undefined>;
  create(data: ICreateOrderDTO): Promise<Order>;
  delete(id: string): Promise<void>;
  save(order: Order): Promise<Order>;
}
