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
    unit,
    wholesale_price,
    image,
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
      unit,
      wholesale_price,
    });

    return product;
  }
}

export default CreateProductService;
