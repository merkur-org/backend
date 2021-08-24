import ICreateOrderDTO from '@modules/orders/dtos/ICreateOrderDTO';
import IPaginatedOrdersDTO from '@modules/orders/dtos/IPaginatedOrdersDTO';
import IPaginationOrdersDTO from '@modules/orders/dtos/IPaginationOrdersDTO';
import IOrdersRepository, {
  IFindAllOrdersPaginated,
} from '@modules/orders/repositories/IOrdersRepository';
import IFindAllInPeriod from '@shared/dtos/IFindAllInPeriod';
import { mountQueryWhere } from '@shared/utils/helpers';
import { addHours, format } from 'date-fns';
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
    list_id,
  }: ICreateOrderDTO): Promise<Order> {
    const order = this.ormRepository.create({
      date,
      delivery_point_id,
      final_value,
      payment_status,
      payment_type,
      sales_type,
      user_id,
      list_id,
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
    limit,
    page,
    sort_by,
    order,
    start_date,
    end_date,
    ...filter
  }: IPaginationOrdersDTO): Promise<IPaginatedOrdersDTO> {
    const skipped_items = (page - 1) * limit;

    let queryWhere = mountQueryWhere(filter, 'o');

    const total_count = await this.ormRepository.count();

    if (start_date) {
      const endDate = end_date
        ? new Date(
            format(addHours(new Date(end_date), 3), 'yyyy/MM/dd 23:59'),
          ).toUTCString()
        : 'now()';

      const dateWhere = new Date(
        format(addHours(new Date(start_date), 3), 'yyyy/MM/dd 23:59'),
      );

      queryWhere += ` "o"."date"
      BETWEEN '${dateWhere.toUTCString()}' AND '${endDate}'`;
    }

    const orders = await this.ormRepository
      .createQueryBuilder('o')
      .select('o.*')
      .where(queryWhere)
      .addSelect('json_agg(od) as "details"')
      .orderBy(`o.${sort_by || 'created_at'}`, order)
      .leftJoin(OrderDetail, 'od', 'o.id = od.order_id')
      .groupBy('o.id')
      .offset(skipped_items)
      .limit(limit)
      .getRawMany();

    return {
      total_count,
      page,
      limit,
      data: orders,
    };
  }

  public async findByUserId({
    user_id,
    page,
    limit,
  }: IFindAllOrdersPaginated): Promise<IPaginatedOrdersDTO> {
    const skipped_items = (page - 1) * limit;

    const [orders, total_count] = await this.ormRepository.findAndCount({
      where: { user_id },
      relations: ['order_details'],
      skip: skipped_items,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return {
      total_count,
      page,
      limit,
      data: orders,
    };
  }
}

export default OrdersRepository;
