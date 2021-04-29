import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateListService from '@modules/lists/services/CreateListService';
import ShowListService from '@modules/lists/services/ShowListService';
import DeleteListService from '@modules/lists/services/DeleteListService';
import ListListsService from '@modules/lists/services/ListListsService';
import UpdateListService from '@modules/lists/services/UpdateListService';
import { TList } from '../../typeorm/entities/List';

class ListsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { id: user_id } = request.user;
    const { start_date, end_date, status, details, type } = request.body;

    const createList = container.resolve(CreateListService);

    const list = await createList.execute({
      details,
      start_date,
      end_date,
      type,
      user_id,
      status,
    });

    return response.json(list);
  }

  public async list(request: Request, response: Response): Promise<Response> {
    const { page = 1, limit = 10, user_id, type } = request.query;

    const listLists = container.resolve(ListListsService);

    const data = await listLists.execute({
      user_id: user_id ? String(user_id) : undefined,
      page: Number(page),
      limit: Number(limit),
      type: type as TList,
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
    const { start_date, status, end_date, type, details } = request.body;
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
    });

    return response.json(list);
  }
}

export default ListsController;
