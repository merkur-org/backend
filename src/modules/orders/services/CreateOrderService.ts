import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';

import ICreateOrderDetailDTO from '../dtos/ICreateOrderDetailDTO';
import ICreateOrderDTO from '../dtos/ICreateOrderDTO';
import Order from '../infra/typeorm/entities/Order';
import OrderDetail from '../infra/typeorm/entities/OrderDetail';
import IOrderDetailsRepository from '../repositories/IOrderDetailsRepository';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IRequest extends ICreateOrderDTO {
  details: Omit<ICreateOrderDetailDTO, 'order_id'>[];
}

interface IResponse {
  order: Order;
  order_details: OrderDetail[];
}
@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('OrderDetailsRepository')
    private orderDetailsRepository: IOrderDetailsRepository,
  ) {}

  public async execute({
    user_id,
    date,
    delivery_point_id,
    final_value,
    payment_status,
    payment_type,
    sales_type,
    value,
    details,
    list_id,
  }: IRequest): Promise<IResponse> {
    const order = await this.ordersRepository.create({
      user_id,
      date,
      delivery_point_id,
      final_value,
      payment_status,
      payment_type,
      sales_type,
      value,
      list_id,
    });

    const serializedProducts = details.map(detail => {
      return {
        ...detail,
        order_id: order.id,
      };
    });

    const orderDetails = await this.orderDetailsRepository.create(
      serializedProducts,
    );

    return {
      order,
      order_details: orderDetails,
    };
  }
}

export default CreateOrderService;
