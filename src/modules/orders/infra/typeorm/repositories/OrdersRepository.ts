import ICreateOrderDTO from '@modules/orders/dtos/ICreateOrderDTO';
import IPaginatedOrdersDTO from '@modules/orders/dtos/IPaginatedOrdersDTO';
import IOrdersRepository, {
  IFindAllOrdersPaginated,
} from '@modules/orders/repositories/IOrdersRepository';
import IFindAllInPeriod from '@shared/dtos/IFindAllInPeriod';
import { getRepository, Repository, Between } from 'typeorm';
import Order from '../entities/Order';
import OrderDetail from '../entities/OrderDetail';

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
    const foundOrders = this.ormRepository.find({
      where: { user_id },
    });

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

  public async findAllPaginated({
    user_id,
    page,
    limit,
  }: IFindAllOrdersPaginated): Promise<IPaginatedOrdersDTO> {
    const skippedItems = (page - 1) * limit;

    const totalCount = await this.ormRepository.count();
    const orders = await this.ormRepository
      .createQueryBuilder('o')
      .select('o.*')
      .addSelect('json_agg(od) as "details"')
      .orderBy('o.created_at', 'DESC')
      .leftJoin(OrderDetail, 'od', 'o.id = od.order_id')
      .where('o.user_id = :user_id', { user_id })
      .groupBy('o.id')
      .offset(skippedItems)
      .limit(limit)
      .getRawMany();

    return {
      totalCount,
      page,
      limit,
      data: orders,
    };
  }
}

export default OrdersRepository;
