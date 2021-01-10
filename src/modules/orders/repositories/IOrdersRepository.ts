import IFindAllInPeriod from '@shared/dtos/IFindAllInPeriod';
import ICreateOrderDTO from '../dtos/ICreateOrderDTO';
import Order from '../infra/typeorm/entities/Order';

export default interface IOrdersRepository {
  findById(id: string): Promise<Order | undefined>;
  findByUserId(user_id: string): Promise<Order[] | undefined>;
  findByPeriod(period: IFindAllInPeriod): Promise<Order[] | undefined>;
  create(data: ICreateOrderDTO): Promise<Order>;
  delete(id: string): Promise<void>;
  save(order: Order): Promise<Order>;
}
