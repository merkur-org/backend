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

  public async findByUserId({
    limit,
    page,
    user_id,
  }: IFindAllOrdersPaginated): Promise<IPaginatedOrdersDTO> {
    const skipped_items = (page - 1) * limit;
    const ordersArray = this.orders.filter(order => order.user_id === user_id);
    const total_count = ordersArray.length;
    const orders: Order[] = [];

    let i = skipped_items;

    const limitLoop =
      skipped_items + limit < total_count ? skipped_items + limit : total_count - 1;

    if (
      i === 0 &&
      limitLoop === 0 &&
      ordersArray[0] &&
      ordersArray[0].user_id === user_id
    ) {
      orders.push(ordersArray[0]);
    }
    // eslint-disable-next-line no-plusplus
    for (i; i < limitLoop; i++) {
      if (ordersArray[i].user_id === user_id) {
        orders.push(ordersArray[i]);
      }
    }

    return {
      total_count,
      page,
      limit,
      data: orders,
    };
  }

  public async findAllPaginated({
    page,
    limit,
    user_id,
  }: IFindAllOrdersPaginated): Promise<IPaginatedOrdersDTO> {
    const skipped_items = (page - 1) * limit;

    const total_count = this.orders.length;
    const orders: Order[] = [];

    let i = skipped_items;

    const limitLoop =
      skipped_items + limit < total_count ? skipped_items + limit : total_count - 1;

    if (i === 0 && limitLoop === 0 && this.orders[0]) {
      orders.push(this.orders[0]);
    }
    // eslint-disable-next-line no-plusplus
    for (i; i < limitLoop; i++) {
      orders.push(this.orders[i]);
    }

    return {
      total_count,
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
