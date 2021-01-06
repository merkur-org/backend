import { getRepository, Repository, Like } from 'typeorm';

import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import Product from '@modules/products/infra/typeorm/entities/Product';
import IProductsRepository from '@modules/products/repositories/IProductsRepository';

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async findById(id: string): Promise<Product | undefined> {
    const findProduct = await this.ormRepository.findOne(id);

    return findProduct;
  }

  public async findExistingProduct(name: string): Promise<Product | undefined> {
    const findProduct = this.ormRepository.findOne({
      where: { name },
    });
    return findProduct;
  }

  public async findByName(name: string): Promise<Product[] | undefined> {
    const findProduct = this.ormRepository.find({
      where: {
        name: Like(`%${name}%`),
      },
    });
    return findProduct;
  }

  public async create(data: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create(data);

    await this.ormRepository.save(product);

    return product;
  }

  public async delete(id: string): Promise<void> {
    this.ormRepository.delete({ id });
  }

  public async save(product: Product): Promise<Product> {
    await this.ormRepository.save(product);

    return product;
  }
}

export default ProductsRepository;
