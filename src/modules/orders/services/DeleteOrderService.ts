import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IRequest {
  order_id: string;
}

@injectable()
class DeleteOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
  ) {}

  public async execute({ order_id }: IRequest): Promise<{ message: string }> {
    const order = await this.ordersRepository.findById(order_id);

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    await this.ordersRepository.delete(order.id);

    return { message: 'Order deleted.' };
  }
}

export default DeleteOrderService;
