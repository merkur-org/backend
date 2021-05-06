import { container } from 'tsyringe';

import { Request, Response } from 'express';
import { classToClass } from 'class-transformer';
import ListProductsInListService from '@modules/products/services/ListProductsInListService';
import { TList } from '@modules/lists/infra/typeorm/entities/List';

class ProductsInListController {
  public async list(request: Request, response: Response): Promise<Response> {
    const {
      page = 1,
      limit = 10,
      type,
      date,
      sort_by,
      order,
      ...filter
    } = request.query;

    const ListProductsInList = container.resolve(ListProductsInListService);

    const parsedOrder =
      typeof order === 'string' && order.match(/asc/gi) ? 'ASC' : 'DESC';

    const data = await ListProductsInList.execute({
      page: Number(page),
      limit: Number(limit),
      type: type as TList,
      date: new Date(date as string),
      sort_by: sort_by ? String(sort_by) : undefined,
      order: parsedOrder,
      ...filter,
    });

    return response.json(classToClass(data));
  }
}

export default ProductsInListController;
