import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import Product from '../infra/typeorm/entities/Product';
import IProductsRepository from '../repositories/IProductsRepository';
import IUpdateImageDTO from '../dtos/IUpdateImageDTO';

@injectable()
class UpdateImageProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({
    product_id,
    image_name,
  }: IUpdateImageDTO): Promise<Product> {
    const productExists = await this.productsRepository.findById(product_id);

    if (!productExists) {
      throw new AppError(`Product does not exists`, 401);
    }

    const filename = await this.storageProvider.saveFile(image_name);

    productExists.image = filename;

    const product = await this.productsRepository.save(productExists);

    return product;
  }
}

export default UpdateImageProductService;
