import ListHistoryOrdersByUserIdService from '@modules/orders/services/ListHistoryOrdersByUserIdService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

class HistoryOrdersController {
  public async list(request: Request, response: Response): Promise<Response> {
    const { page = 1, limit = 10 } = request.query;
    const { id: user_id } = request.user;
    const listHistoryOrdersByUserId = container.resolve(
      ListHistoryOrdersByUserIdService,
    );

    const data = await listHistoryOrdersByUserId.execute({
      user_id: String(user_id),
      page: Number(page),
      limit: Number(limit),
    });

    return response.json(data);
  }
}

export default HistoryOrdersController;
