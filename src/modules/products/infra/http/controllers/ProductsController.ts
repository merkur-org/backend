import { container } from 'tsyringe';

import CreateProductService from '@modules/products/services/CreateProductService';
import { Request, Response } from 'express';
import { IRole } from '@modules/users/dtos/ICreateUserDTO';

class ProductsController {
  // CRUD create read (list, show), update, delete

  public async create(request: Request, response: Response): Promise<Response> {
    const {
      name,
      cost_price,
      sale_price,
      unit,
      wholesale_price,
    } = request.body;

    const { role } = request.user;

    // const createProductService = new CreateProductService(ProductsRepository);
    const createProduct = container.resolve(CreateProductService);

    const product = await createProduct.execute({
      name,
      cost_price,
      sale_price,
      unit,
      wholesale_price,
      role: role as IRole,
    });

    return response.json(product);
  }
}

export default ProductsController;
