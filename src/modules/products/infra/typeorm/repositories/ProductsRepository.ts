import { getRepository, Repository } from 'typeorm';

import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import Product from '@modules/products/infra/typeorm/entities/Product';
import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import IPaginationDTO from '@shared/dtos/IPaginationDTO';
import IPaginatedProductsDTO from '@modules/products/dtos/IPaginatedProductsDTO';

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

  public async findByName({
    limit,
    page,
    name,
  }: IPaginationDTO): Promise<IPaginatedProductsDTO> {
    const skipped_items = (page - 1) * limit;

    const [products, total_count] = await this.ormRepository
      .createQueryBuilder('products')
      .where(
        `to_tsvector('portuguese', unaccent(products.name)) @@
    plainto_tsquery('portuguese', unaccent('${name}'))`,
      )
      .offset(skipped_items)
      .limit(limit)
      .getManyAndCount();

    return {
      total_count,
      page,
      limit,
      data: products,
    };
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

  public async findAllPaginated({
    limit,
    page,
    name,
  }: IPaginationDTO): Promise<IPaginatedProductsDTO> {
    const skipped_items = (page - 1) * limit;

    const total_count = await this.ormRepository.count();
    const products = await this.ormRepository
      .createQueryBuilder('products')
      .orderBy('created_at', 'DESC')
      .where(
        name
          ? `to_tsvector('portuguese', unaccent(products.name)) @@
    plainto_tsquery('portuguese', unaccent('${name}'))`
          : '',
      )
      .offset(skipped_items)
      .limit(limit)
      .getMany();

    return {
      total_count,
      page,
      limit,
      data: products,
    };
  }
}

export default ProductsRepository;
