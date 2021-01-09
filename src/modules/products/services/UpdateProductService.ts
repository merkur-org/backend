import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import { IRole } from '@modules/users/dtos/ICreateUserDTO';
import IProductsRepository from '../repositories/IProductsRepository';
import Product from '../infra/typeorm/entities/Product';
import ICreateProductDTO from '../dtos/ICreateProductDTO';

interface IRequest extends ICreateProductDTO {
  product_id: string;
  role: IRole;
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
    role,
  }: IRequest): Promise<Product> {
    if (!role.match(/r|a/g)) {
      throw new AppError('You dont have permission to do this action', 401);
    }

    const foundProduct = await this.productsRepository.findById(product_id);

    if (!foundProduct) {
      throw new AppError('Product does not exist', 404);
    }

    foundProduct.name = name;
    foundProduct.unit = unit;
    foundProduct.cost_price = cost_price;
    foundProduct.sale_price = sale_price;
    // todo: optional value to number
    // foundProduct.wholesale_price = wholesale_price;

    await this.productsRepository.save(foundProduct);

    return foundProduct;
  }
}

export default UpdateProductService;
