import CreateOrderService from '@modules/orders/services/CreateOrderService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

class OrdersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { id: user_id } = request.user;

    const {
      date,
      delivery_point_id,
      final_value,
      payment_status,
      payment_type,
      sales_type,
      value,
      details,
    } = request.body;

    const createOrderService = container.resolve(CreateOrderService);

    const order = await createOrderService.execute({
      user_id,
      date,
      delivery_point_id,
      final_value,
      payment_status,
      payment_type,
      sales_type,
      value,
      details,
    });

    return response.json(order);
  }
}

export default OrdersController;
