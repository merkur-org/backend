import ICreateOrderDTO from '@modules/orders/dtos/ICreateOrderDTO';
import IPaginatedOrdersDTO from '@modules/orders/dtos/IPaginatedOrdersDTO';
import IFindAllInPeriod from '@shared/dtos/IFindAllInPeriod';
import { v4 as uuid } from 'uuid';

import Order from '../../infra/typeorm/entities/Order';
import IOrdersRepository, {
  IFindAllOrdersPaginated,
} from '../IOrdersRepository';

class FakeOrdersRepository implements IOrdersRepository {
  private orders: Order[] = [];

  public async findById(id: string): Promise<Order | undefined> {
    const foundOrder = this.orders.find(order => order.id === id);

    return foundOrder;
  }

  public async findByUserId(user_id: string): Promise<Order[] | undefined> {
    const foundOrders = this.orders.filter(order => order.user_id === user_id);

    return foundOrders;
  }

  public async findAllPaginated({
    page,
    limit,
    user_id,
  }: IFindAllOrdersPaginated): Promise<IPaginatedOrdersDTO> {
    const skippedItems = (page - 1) * limit;

    const totalCount = this.orders.length;
    const orders: Order[] = [];

    let i = skippedItems;

    const limitLoop =
      skippedItems + limit < totalCount ? skippedItems + limit : totalCount - 1;

    if (i === 0 && limitLoop === 0 && this.orders[0]) {
      orders.push(this.orders[0]);
    }
    // eslint-disable-next-line no-plusplus
    for (i; i < limitLoop; i++) {
      orders.push(this.orders[i]);
    }

    return {
      totalCount,
      page,
      limit,
      data: orders,
    };
  }

  public async findByPeriod({
    start_date,
    end_date = new Date(),
  }: IFindAllInPeriod): Promise<Order[] | undefined> {
    const foundOrders = this.orders.filter(
      order =>
        order.created_at.getTime() >= start_date.getTime() &&
        order.created_at.getTime() <= end_date.getTime(),
    );

    return foundOrders;
  }

  public async create({
    user_id,
    date,
    delivery_point_id,
    final_value,
    payment_status,
    payment_type,
    sales_type,
    value,
  }: ICreateOrderDTO): Promise<Order> {
    const order = new Order();

    Object.assign(
      order,
      { id: uuid() },
      {
        user_id,
        date,
        delivery_point_id,
        final_value,
        payment_status,
        payment_type,
        sales_type,
        value,
      },
    );

    this.orders.push(order);

    return order;
  }

  public async delete(id: string): Promise<void> {
    this.orders.filter(order => order.id !== id);
  }

  public async save(order: Order): Promise<Order> {
    const findIndex = this.orders.findIndex(
      foundorder => foundorder.id === order.id,
    );

    this.orders[findIndex] = order;

    return order;
  }
}

export default FakeOrdersRepository;
