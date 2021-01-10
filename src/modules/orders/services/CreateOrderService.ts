import { injectable, inject } from 'tsyringe';

import ICreateOrderDetailDTO from '../dtos/ICreateOrderDetailDTO';
import ICreateOrderDTO from '../dtos/ICreateOrderDTO';
import Order from '../infra/typeorm/entities/Order';
import OrderDetail from '../infra/typeorm/entities/OrderDetail';
import IOrderDetailsRepository from '../repositories/IOrderDetailsRepository';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IRequest extends ICreateOrderDTO {
  // details: Omit<ICreateOrderDetailDTO, 'order_id'>[];
  details: ICreateOrderDetailDTO[];
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
    private OrderDetailsRepository: IOrderDetailsRepository,
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
    });

    const serializedProducts = details.map(detail => {
      return {
        ...detail,
        order_id: '373eee3c-4f78-440f-a2ab-e99abbab017e',
      };
    });

    const orderDetails = await this.OrderDetailsRepository.create(
      serializedProducts,
    );

    return {
      order,
      order_details: orderDetails,
    };
  }
}

export default CreateOrderService;