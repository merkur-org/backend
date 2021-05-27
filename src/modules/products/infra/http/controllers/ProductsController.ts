import { container } from 'tsyringe';

import CreateProductService from '@modules/products/services/CreateProductService';
import { Request, Response } from 'express';
import DeleteProductService from '@modules/products/services/DeleteProductService';
import UpdateProductService from '@modules/products/services/UpdateProductService';
import ShowProductService from '@modules/products/services/ShowProductService';
import ListProductsService from '@modules/products/services/ListProductsService';
import { classToClass } from 'class-transformer';

class ProductsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const {
      name,
      cost_price,
      sale_price,
      unit_buy,
      fraction_buy,
      fraction_sale,
      unit_sale,
      wholesale_price,
      nutritional_information,
      observation,
      organic,
      highlights,
      category,
    } = request.body;
    const createProduct = container.resolve(CreateProductService);

    const product = await createProduct.execute({
      name,
      cost_price,
      sale_price,
      highlights,
      organic,
      unit_buy,
      fraction_buy,
      fraction_sale,
      unit_sale,
      wholesale_price,
      category,
      observation,
      nutritional_information,
    });

    return response.json(classToClass(product));
  }

  public async list(request: Request, response: Response): Promise<Response> {
    const { page = 1, limit = 10, sort_by, order, ...filter } = request.query;

    const listProducts = container.resolve(ListProductsService);

    const parsedOrder =
      typeof order === 'string' && order.match(/asc/gi) ? 'ASC' : 'DESC';

    const data = await listProducts.execute({
      page: Number(page),
      limit: Number(limit),
      sort_by: sort_by ? String(sort_by) : undefined,
      order: parsedOrder,
      ...filter,
    });

    return response.json(classToClass(data));
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { product_id } = request.params;

    const showProduct = container.resolve(ShowProductService);

    const product = await showProduct.execute({ product_id });

    return response.json(product);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { product_id } = request.params;

    const {
      name,
      cost_price,
      sale_price,
      unit_buy,
      highlights,
      organic,
      fraction_buy,
      fraction_sale,
      unit_sale,
      wholesale_price,
      nutritional_information,
      observation,
      category,
    } = request.body;

    const updateProduct = container.resolve(UpdateProductService);

    const product = await updateProduct.execute({
      product_id,
      name,
      cost_price,
      sale_price,
      unit_buy,
      highlights,
      organic,
      fraction_buy,
      fraction_sale,
      unit_sale,
      wholesale_price,
      nutritional_information,
      observation,
      category,
    });

    return response.json(product);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { product_id } = request.params;

    const deleteProduct = container.resolve(DeleteProductService);

    const message = await deleteProduct.execute({
      product_id,
    });

    return response.json(message);
  }
}

export default ProductsController;
