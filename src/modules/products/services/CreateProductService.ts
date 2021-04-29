import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import ICreateProductDTO from '../dtos/ICreateProductDTO';
import Product from '../infra/typeorm/entities/Product';
import IProductsRepository from '../repositories/IProductsRepository';

@injectable()
class CreateProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({
    name,
    cost_price,
    sale_price,
    unit_sale,
    unit_buy,
    fraction_buy,
    fraction_sale,
    nutritional_information,
    observation,
    wholesale_price,
    image,
    highlights,
    organic,
  }: ICreateProductDTO): Promise<Product> {
    const productAlreadyExists = await this.productsRepository.findExistingProduct(
      name,
    );

    if (productAlreadyExists) {
      throw new AppError(
        `Product ${productAlreadyExists.name} already exists`,
        401,
      );
    }

    let filename: string | undefined;

    if (image) {
      filename = await this.storageProvider.saveFile(image);
    }

    const product = await this.productsRepository.create({
      name,
      cost_price,
      image: filename,
      sale_price,
      unit_sale,
      unit_buy,
      fraction_buy,
      fraction_sale,
      wholesale_price,
      nutritional_information,
      observation,
      highlights,
      organic,
    });

    return product;
  }
}

export default CreateProductService;
