import { getRepository, Repository, EntityManager, getManager } from 'typeorm';

import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import Product from '@modules/products/infra/typeorm/entities/Product';
import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import IPaginationDTO from '@shared/dtos/IPaginationDTO';
import IPaginatedProductsDTO from '@modules/products/dtos/IPaginatedProductsDTO';
import ListOffersDetail from '@modules/lists/infra/typeorm/entities/ListOffersDetail';
import List from '@modules/lists/infra/typeorm/entities/List';
import ListProducersDetail from '@modules/lists/infra/typeorm/entities/ListProducersDetail';
import IPaginationInListDTO from '@modules/products/dtos/IPaginationInListDTO';
import logger from '@shared/utils/logger';

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  private manager: EntityManager;

  constructor() {
    this.ormRepository = getRepository(Product);
    this.manager = getManager();
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

  public async findAllInListDetailsPaginated({
    limit,
    name,
    page,
    type,
    date,
  }: IPaginationInListDTO): Promise<IPaginatedProductsDTO> {
    const skipped_items = (page - 1) * limit;

    const entity = type === 'offer' ? ListOffersDetail : ListProducersDetail;

    const query = this.ormRepository
      .createQueryBuilder('product')
      .leftJoin(entity, 'ld', 'ld.product_id = product.id')
      .leftJoin(List, 'l', 'l.id = ld.list_id')
      .where(
        name
          ? `to_tsvector('portuguese', unaccent(product.name)) @@
plainto_tsquery('portuguese', unaccent('${name}'))`
          : '',
      )
      .andWhere(
        `'${date.toUTCString()}'
      BETWEEN "l"."start_date" AND "l"."end_date"`,
      )
      .groupBy('product.id')
      .orderBy('product.created_at', 'DESC')
      .offset(skipped_items)
      .limit(limit);

    logger.info(query.getSql());

    const [products, total_count] = await query.getManyAndCount();

    return {
      limit,
      page,
      total_count,
      data: products,
    };
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
