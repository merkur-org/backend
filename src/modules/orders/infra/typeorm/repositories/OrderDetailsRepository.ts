import ICreateOrderDetailDTO from '@modules/orders/dtos/ICreateOrderDetailDTO';
import IOrderDetailsRepository from '@modules/orders/repositories/IOrderDetailsRepository';
import { getRepository, Repository } from 'typeorm';
import OrderDetail from '../entities/OrderDetail';

class OrderDetailsRepository implements IOrderDetailsRepository {
  private ormReposiroty: Repository<OrderDetail>;

  constructor() {
    this.ormReposiroty = getRepository(OrderDetail);
  }

  public async findById(id: string): Promise<OrderDetail | undefined> {
    const foundDetail = this.ormReposiroty.findOne(id);

    return foundDetail;
  }

  public async findByOrderId(
    order_id: string,
  ): Promise<OrderDetail[] | undefined> {
    const foundDetail = this.ormReposiroty.find({ where: { order_id } });

    return foundDetail;
  }

  public async create(data: ICreateOrderDetailDTO[]): Promise<OrderDetail[]> {
    const details = this.ormReposiroty.create(data.map(d => d));
    await this.ormReposiroty.save(details);

    return details;
  }

  public async delete(id: string): Promise<void> {
    this.ormReposiroty.delete({ id });
  }

  public async save(OrderDetails: OrderDetail[]): Promise<OrderDetail[]> {
    await this.ormReposiroty.save(OrderDetails);

    return OrderDetails;
  }
}

export default OrderDetailsRepository;
