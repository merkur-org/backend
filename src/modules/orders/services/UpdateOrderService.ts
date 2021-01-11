import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import ICreateOrderDetailDTO from '../dtos/ICreateOrderDetailDTO';
import Order from '../infra/typeorm/entities/Order';
import OrderDetail from '../infra/typeorm/entities/OrderDetail';
import IOrderDetailsRepository from '../repositories/IOrderDetailsRepository';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IDetails extends Omit<ICreateOrderDetailDTO, 'order_id'> {
  id: string;
}

interface IRequest {
  order: Order;
  details: IDetails[];
}

interface IResponse {
  order: Order;
  order_details: OrderDetail[];
}

@injectable()
class UpdateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('OrderDetailsRepository')
    private orderDetailsRepository: IOrderDetailsRepository,
  ) {}

  public async execute({ order, details }: IRequest): Promise<IResponse> {
    const foundOrderPromise = this.ordersRepository.findById(order.id);

    const foundDetailsPromise = this.orderDetailsRepository.findByOrderId(
      order.id,
    );

    const [foundOrder, foundDetails] = await Promise.all([
      foundOrderPromise,
      foundDetailsPromise,
    ]);

    if (!foundOrder || !foundDetails) {
      throw new AppError('Order not found or order not details.', 400);
    }

    foundOrder.value = order.value || foundOrder.value;
    foundOrder.date = order.date || foundOrder.date;
    // eslint-disable-next-line prettier/prettier
    foundOrder.delivery_point_id = order.delivery_point_id || foundOrder.delivery_point_id;
    // eslint-disable-next-line prettier/prettier
    foundOrder.payment_status = order.payment_status || foundOrder.payment_status;
    foundOrder.payment_type = order.payment_type || foundOrder.payment_type;
    foundOrder.sales_type = order.sales_type || foundOrder.sales_type;
    foundOrder.updated_at = new Date();

    const detailsChanged = details.map(detail => {
      const index = foundDetails.findIndex(d => d.id === detail.id);

      const detailChanged = foundDetails[index];

      detailChanged.discount = detail.discount || detailChanged.discount;
      detailChanged.quantity = detail.quantity || detailChanged.quantity;
      detailChanged.unit_price = detail.unit_price || detailChanged.unit_price;
      detailChanged.updated_at = new Date();

      return detailChanged;
    });

    const orderUpdatedPromise = this.ordersRepository.save(foundOrder);
    const detailsUpdatedPromise = this.orderDetailsRepository.save(
      detailsChanged,
    );

    const [orderUpdated, detailsUpdated] = await Promise.all([
      orderUpdatedPromise,
      detailsUpdatedPromise,
    ]);

    return {
      order: orderUpdated,
      order_details: detailsUpdated,
    };
  }
}

export default UpdateOrderService;
