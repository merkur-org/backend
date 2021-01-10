import ICreateOrderDTO from '@modules/orders/dtos/ICreateOrderDTO';
import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import IFindAllInPeriod from '@shared/dtos/IFindAllInPeriod';
import { getRepository, Repository, Between } from 'typeorm';
import Order from '../entities/Order';

class OrdersRepository implements IOrdersRepository {
  private ormRepository: Repository<Order>;

  constructor() {
    this.ormRepository = getRepository(Order);
  }

  public async findById(id: string): Promise<Order | undefined> {
    const foundOrder = this.ormRepository.findOne(id);

    return foundOrder;
  }

  public async findByUserId(user_id: string): Promise<Order[] | undefined> {
    const foundOrders = this.ormRepository.find({ where: { user_id } });

    return foundOrders;
  }

  public async findByPeriod({
    start_date,
    end_date = new Date(),
  }: IFindAllInPeriod): Promise<Order[] | undefined> {
    const foundOrders = this.ormRepository.find({
      where: Between(start_date, end_date),
    });

    return foundOrders;
  }

  public async create({
    date,
    delivery_point_id,
    final_value,
    payment_status,
    payment_type,
    sales_type,
    user_id,
    value,
  }: ICreateOrderDTO): Promise<Order> {
    const order = this.ormRepository.create({
      date,
      delivery_point_id,
      final_value,
      payment_status,
      payment_type,
      sales_type,
      user_id,
      value,
    });

    await this.ormRepository.save(order);

    return order;
  }

  public async delete(id: string): Promise<void> {
    this.ormRepository.delete({ id });
  }

  public async save(order: Order): Promise<Order> {
    await this.ormRepository.save(order);

    return order;
  }
}

export default OrdersRepository;
