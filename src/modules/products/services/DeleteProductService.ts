import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';

import logger from '@shared/utils/logger';

import IProductsRepository from '../repositories/IProductsRepository';

interface IRequest {
  product_id: string;
}

@injectable()
class DeleteProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute({ product_id }: IRequest): Promise<{ message: string }> {
    const productAlreadyExists = await this.productsRepository.findById(
      product_id,
    );

    if (!productAlreadyExists) {
      throw new AppError('Product does not exist', 404);
    }
    await this.productsRepository.delete(product_id);

    logger.info('Product successfully deleted');

    return { message: 'Product successfully deleted' };
  }
}

export default DeleteProductService;
