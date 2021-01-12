import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import Order from '../infra/typeorm/entities/Order';
import OrderDetail from '../infra/typeorm/entities/OrderDetail';
import IOrdersRepository from '../repositories/IOrdersRepository';
import IOrderDetailsRepository from '../repositories/IOrderDetailsRepository';

interface IRequest {
  order_id: string;
}

interface IResponse {
  order: Order;
  order_details: OrderDetail[];
}

@injectable()
class ShowOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('OrderDetailsRepository')
    private orderDetailsRepository: IOrderDetailsRepository,
  ) {}

  public async execute({ order_id }: IRequest): Promise<IResponse> {
    const order = await this.ordersRepository.findById(order_id);

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    const orderDetails = await this.orderDetailsRepository.findByOrderId(
      order_id,
    );

    return {
      order,
      order_details: orderDetails as OrderDetail[],
    };
  }
}

export default ShowOrderService;
