import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IProductsRepository from '../repositories/IProductsRepository';
import Product from '../infra/typeorm/entities/Product';

interface IRequest {
  product_id: string;
}

@injectable()
class ShowProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute({ product_id }: IRequest): Promise<Product> {
    const foundProduct = await this.productsRepository.findById(product_id);

    if (!foundProduct) {
      throw new AppError('Product does not exist', 404);
    }

    return foundProduct;
  }
}

export default ShowProductService;
