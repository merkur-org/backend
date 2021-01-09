import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateWeeklyListService from '@modules/weekly-list/services/CreateWeeklyListService';

class WeeklyListController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { products } = request.body;

    const createWeeklyList = container.resolve(CreateWeeklyListService);

    const weeklyListDetials = await createWeeklyList.execute(products);

    return response.json({ weeklyListDetails: weeklyListDetials });
  }
}

export default WeeklyListController;
