import ICreateOrderDetailDTO from '@modules/orders/dtos/ICreateOrderDetailDTO';
import OrderDetail from '@modules/orders/infra/typeorm/entities/OrderDetail';
import { v4 as uuid } from 'uuid';
import IOrderDetailsRepository from '../IOrderDetailsRepository';

class FakeOrderDetailsRepository implements IOrderDetailsRepository {
  private orderDetails: OrderDetail[] = [];

  public async findById(id: string): Promise<OrderDetail | undefined> {
    const foundDetail = this.orderDetails.find(
      orderDetail => orderDetail.id === id,
    );

    return foundDetail;
  }

  public async findByOrderId(
    order_id: string,
  ): Promise<OrderDetail[] | undefined> {
    const foundDetail = this.orderDetails.filter(
      orderDetail => orderDetail.order_id === order_id,
    );

    return foundDetail;
  }

  public async create(data: ICreateOrderDetailDTO[]): Promise<OrderDetail[]> {
    const OrderDetails = data.map(orderDetail => {
      const detail = new OrderDetail();
      Object.assign(detail, { id: uuid() }, orderDetail);

      this.orderDetails.push(detail);
      return detail;
    });

    return OrderDetails;
  }

  public async delete(id: string): Promise<void> {
    this.orderDetails = this.orderDetails.filter(detail => detail.id !== id);
  }

  public async save(OrderDetails: OrderDetail[]): Promise<OrderDetail[]> {
    const savedOrders = OrderDetails.map(orderDetail => {
      const findIndex = this.orderDetails.findIndex(
        foundDetail => foundDetail.id === orderDetail.id,
      );

      this.orderDetails[findIndex] = orderDetail;

      return orderDetail;
    });

    return savedOrders;
  }
}

export default FakeOrderDetailsRepository;
