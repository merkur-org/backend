import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IProductsRepository from '../repositories/IProductsRepository';
import Product, { IUnit } from '../infra/typeorm/entities/Product';

interface IRequest {
  product_id: string;
  name?: string;
  unit?: IUnit;
  cost_price?: number;
  sale_price?: number;
  wholesale_price?: number;
}

@injectable()
class UpdateProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute({
    product_id,
    name,
    cost_price,
    sale_price,
    unit,
    wholesale_price,
  }: IRequest): Promise<Product> {
    const foundProduct = await this.productsRepository.findById(product_id);

    if (!foundProduct) {
      throw new AppError('Product does not exist', 404);
    }

    foundProduct.name = name || foundProduct.name;
    foundProduct.unit = unit || foundProduct.unit;
    foundProduct.cost_price = cost_price || foundProduct.cost_price;
    foundProduct.sale_price = sale_price || foundProduct.sale_price;
    foundProduct.wholesale_price =
      wholesale_price || foundProduct.wholesale_price;
    foundProduct.updated_at = new Date();

    await this.productsRepository.save(foundProduct);

    return foundProduct;
  }
}

export default UpdateProductService;
