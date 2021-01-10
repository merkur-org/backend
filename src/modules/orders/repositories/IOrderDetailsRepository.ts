import ICreateOrderDetailDTO from '../dtos/ICreateOrderDetailDTO';
import OrderDetail from '../infra/typeorm/entities/OrderDetail';

export default interface IOrderDetailsRepository {
  findById(id: string): Promise<OrderDetail | undefined>;
  findByOrderId(order_id: string): Promise<OrderDetail[] | undefined>;
  create(data: ICreateOrderDetailDTO[]): Promise<OrderDetail[]>;
  delete(id: string): Promise<void>;
  save(orderDetail: OrderDetail[]): Promise<OrderDetail[]>;
}
