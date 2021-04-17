import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListWeeklyOfferActivePerDateService from 'modules/weekly-offers/services/ListWeeklyOfferActivePerDateService';

class WeeklyOfferActiveController {
  public async list(request: Request, response: Response): Promise<Response> {
    const { page = 1, limit = 10, date = new Date() } = request.query;

    const listWeeklyOfferActivePerDate = container.resolve(
      ListWeeklyOfferActivePerDateService,
    );

    const data = await listWeeklyOfferActivePerDate.execute({
      page: Number(page),
      limit: Number(limit),
      date: date as Date,
    });

    return response.json(data);
  }
}

export default WeeklyOfferActiveController;
