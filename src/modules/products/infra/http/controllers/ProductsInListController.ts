import { container } from 'tsyringe';

import { Request, Response } from 'express';
import { classToClass } from 'class-transformer';
import ListProductsInListService from '@modules/products/services/ListProductsInListService';
import { TList } from '@modules/lists/infra/typeorm/entities/List';

class ProductsInListController {
  public async list(request: Request, response: Response): Promise<Response> {
    const { page = 1, limit = 10, name, type, date } = request.query;

    const ListProductsInList = container.resolve(ListProductsInListService);

    const data = await ListProductsInList.execute({
      page: Number(page),
      limit: Number(limit),
      name: name ? String(name) : undefined,
      type: type as TList,
      date: new Date(date as string),
    });

    return response.json(classToClass(data));
  }
}

export default ProductsInListController;
