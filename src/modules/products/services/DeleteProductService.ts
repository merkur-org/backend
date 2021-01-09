import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';

import logger from '@shared/utils/logger';

import { IRole } from '@modules/users/dtos/ICreateUserDTO';
import IProductsRepository from '../repositories/IProductsRepository';

interface IRequest {
  product_id: string;
  role: IRole;
}

@injectable()
class DeleteProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute({
    product_id,
    role,
  }: IRequest): Promise<{ message: string }> {
    if (!role.match(/r|a/g)) {
      throw new AppError('You dont have permission to do this action', 401);
    }

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
