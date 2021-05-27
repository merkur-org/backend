import CreateOrderService from '@modules/orders/services/CreateOrderService';
import DeleteOrderService from '@modules/orders/services/DeleteOrderService';
import ListOrdersService from '@modules/orders/services/ListOrdersService';
import ShowOrderService from '@modules/orders/services/ShowOrderService';
import UpdateOrderService from '@modules/orders/services/UpdateOrderService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import Order from '../../typeorm/entities/Order';

class OrdersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { id: user_id } = request.user;

    const {
      date = new Date(),
      delivery_point_id,
      final_value,
      payment_status,
      payment_type,
      sales_type,
      value,
      details,
      list_id,
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
      list_id,
    });

    return response.json(order);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    // const { id: user_id } = request.user;
    const { order_id } = request.params;

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

    const updateOrderService = container.resolve(UpdateOrderService);

    const order = await updateOrderService.execute({
      order: {
        id: order_id,
        date,
        delivery_point_id,
        final_value,
        payment_status,
        payment_type,
        sales_type,
        value,
      } as Order,
      details,
    });

    return response.json(order);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { order_id } = request.params;

    const deleteOrderService = container.resolve(DeleteOrderService);

    const message = await deleteOrderService.execute({ order_id });

    return response.json(message);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { order_id } = request.params;

    const ShowOrder = container.resolve(ShowOrderService);

    const order = await ShowOrder.execute({ order_id });

    return response.json(order);
  }

  public async list(request: Request, response: Response): Promise<Response> {
    const { page = 1, limit = 10, sort_by, order, ...filter } = request.query;

    const parsedOrder =
      typeof order === 'string' && order.match(/asc/gi) ? 'ASC' : 'DESC';

    const listOrders = container.resolve(ListOrdersService);

    const data = await listOrders.execute({
      page: Number(page),
      limit: Number(limit),
      sort_by: sort_by ? String(sort_by) : undefined,
      order: parsedOrder,
      ...filter,
    });

    return response.json(data);
  }
}

export default OrdersController;
