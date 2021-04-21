import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListListsActivePerDateService from '@modules/lists/services/ListListsActivePerDateService';

class ActiveListsController {
  public async list(request: Request, response: Response): Promise<Response> {
    const { page = 1, limit = 10, date = new Date() } = request.query;

    const listListsActivePerDate = container.resolve(
      ListListsActivePerDateService,
    );

    const data = await listListsActivePerDate.execute({
      page: Number(page),
      limit: Number(limit),
      date: date as Date,
    });

    return response.json(data);
  }
}

export default ActiveListsController;
