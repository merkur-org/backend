import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListWeeklyListsActivePerDateService from '@modules/weekly-list/services/ListWeeklyListsActivePerDateService';

class WeeklyListsActiveController {
  public async list(request: Request, response: Response): Promise<Response> {
    const { page = 1, limit = 10, date = new Date() } = request.query;

    const listWeeklyListsActivePerDate = container.resolve(
      ListWeeklyListsActivePerDateService,
    );

    const data = await listWeeklyListsActivePerDate.execute({
      page: Number(page),
      limit: Number(limit),
      date: date as Date,
    });

    return response.json(data);
  }
}

export default WeeklyListsActiveController;
