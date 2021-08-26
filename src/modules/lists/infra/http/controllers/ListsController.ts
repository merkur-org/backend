import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateListService from '@modules/lists/services/CreateListService';
import ShowListService from '@modules/lists/services/ShowListService';
import DeleteListService from '@modules/lists/services/DeleteListService';
import ListListsService from '@modules/lists/services/ListListsService';
import UpdateListService from '@modules/lists/services/UpdateListService';

class ListsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { id: user_id } = request.user;
    const {
      start_date,
      end_date,
      status,
      details,
      type,
      producer_id,
    } = request.body;

    const createList = container.resolve(CreateListService);

    const list = await createList.execute({
      details,
      start_date,
      end_date,
      type,
      user_id,
      status,
      producer_id,
    });

    return response.json(list);
  }

  public async list(request: Request, response: Response): Promise<Response> {
    const { page = 1, limit = 10, sort_by, order, ...filter } = request.query;

    const listLists = container.resolve(ListListsService);

    const parsedOrder =
      typeof order === 'string' && order.match(/asc/gi) ? 'ASC' : 'DESC';

    const data = await listLists.execute({
      page: Number(page),
      limit: Number(limit),
      sort_by: sort_by ? String(sort_by) : undefined,
      order: parsedOrder,
      ...filter,
    });

    return response.json(data);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { list_id } = request.params;

    const showListService = container.resolve(ShowListService);

    const list = await showListService.execute({ list_id });

    return response.json(list);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { list_id } = request.params;

    const deleteList = container.resolve(DeleteListService);

    const list = await deleteList.execute({ list_id });

    return response.json({ list });
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { list_id } = request.params;
    const {
      start_date,
      status,
      end_date,
      type,
      details,
      producer_id,
    } = request.body;
    const { id: user_id } = request.user;
    const updateList = container.resolve(UpdateListService);

    const list = await updateList.execute({
      list_id,
      start_date,
      type,
      user_id,
      status,
      end_date,
      details,
      producer_id,
    });

    return response.json(list);
  }
}

export default ListsController;
