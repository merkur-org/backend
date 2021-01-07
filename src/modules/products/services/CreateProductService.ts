import { inject, injectable } from 'tsyringe';

import { IRole } from '@modules/users/dtos/ICreateUserDTO';
import AppError from '@shared/errors/AppError';
import ICreateProductDTO from '../dtos/ICreateProductDTO';
import Product from '../infra/typeorm/entities/Product';
import IProductsRepository from '../repositories/IProductsRepository';

interface IRequest extends ICreateProductDTO {
  role: IRole;
}

@injectable()
class CreateProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute({
    name,
    cost_price,
    sale_price,
    unit,
    wholesale_price,
    role,
  }: IRequest): Promise<Product> {
    if (role !== 'a' && role !== 'r') {
      throw new AppError(
        'Permission denied, only root or admin user can create product',
        401,
      );
    }

    const productAlreadyExists = await this.productsRepository.findExistingProduct(
      name,
    );

    if (productAlreadyExists) {
      throw new AppError(
        `Product ${productAlreadyExists.name} already exists`,
        401,
      );
    }

    const product = await this.productsRepository.create({
      name,
      cost_price,
      sale_price,
      unit,
      wholesale_price,
    });

    return product;
  }
}

export default CreateProductService;
