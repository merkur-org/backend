import ICreateOrderDetailDTO from '@modules/orders/dtos/ICreateOrderDetailDTO';
import IOrderDetailsRepository from '@modules/orders/repositories/IOrderDetailsRepository';
import { getRepository, Repository } from 'typeorm';
import OrderDetail from '../entities/OrderDetail';

class OrderDetailsRepository implements IOrderDetailsRepository {
  private ormRepository: Repository<OrderDetail>;

  constructor() {
    this.ormRepository = getRepository(OrderDetail);
  }

  public async findById(id: string): Promise<OrderDetail | undefined> {
    const foundDetail = this.ormRepository.findOne(id);

    return foundDetail;
  }

  public async findByOrderId(
    order_id: string,
  ): Promise<OrderDetail[] | undefined> {
    const foundDetail = this.ormRepository.find({ where: { order_id } });

    return foundDetail;
  }

  public async create(data: ICreateOrderDetailDTO[]): Promise<OrderDetail[]> {
    const details = this.ormRepository.create(data);

    await this.ormRepository.save(details);

    return details;
  }

  public async delete(id: string): Promise<void> {
    this.ormRepository.delete({ id });
  }

  public async save(OrderDetails: OrderDetail[]): Promise<OrderDetail[]> {
    await this.ormRepository.save(OrderDetails);

    return OrderDetails;
  }
}

export default OrderDetailsRepository;
