import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateWeeklyListService from '@modules/weekly-list/services/CreateWeeklyListService';
import ShowWeeklyListSerice from '@modules/weekly-list/services/ShowWeeklyListService';
import DeleteWeeklyListService from '@modules/weekly-list/services/DeleteWeeklyListService';
import ListWeeklyListsService from '@modules/weekly-list/services/ListWeeklyListsService';
import UpdateWeeklyListService from '@modules/weekly-list/services/UpdateWeeklyListService';

class WeeklyListController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { id: user_id } = request.user;
    const { start_date, end_date, status, details } = request.body;

    const createWeeklyList = container.resolve(CreateWeeklyListService);

    const weeklyList = await createWeeklyList.execute({
      details,
      start_date,
      end_date,
      user_id,
      status,
    });

    return response.json(weeklyList);
  }

  public async list(request: Request, response: Response): Promise<Response> {
    const { page = 1, limit = 10, user_id } = request.query;

    const listWeeklyLists = container.resolve(ListWeeklyListsService);

    const data = await listWeeklyLists.execute({
      user_id: user_id ? String(user_id) : undefined,
      page: Number(page),
      limit: Number(limit),
    });

    return response.json(data);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { list_id } = request.params;

    const showWeeklyList = container.resolve(ShowWeeklyListSerice);

    const weeklyList = await showWeeklyList.execute({ list_id });

    return response.json(weeklyList);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { list_id } = request.params;

    const deleteWeeklyList = container.resolve(DeleteWeeklyListService);

    const list = await deleteWeeklyList.execute({ list_id });

    return response.json({ list });
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { list_id } = request.params;
    const { start_date, status, end_date, details } = request.body;

    const updateWeeklyList = container.resolve(UpdateWeeklyListService);

    const list = await updateWeeklyList.execute({
      list_id,
      start_date,
      status,
      end_date,
      details,
    });

    return response.json(list);
  }
}

export default WeeklyListController;
