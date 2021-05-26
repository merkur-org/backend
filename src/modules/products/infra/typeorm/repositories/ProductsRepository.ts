import { getRepository, Repository } from 'typeorm';

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
import { mountQueryWhereWithName } from '@shared/utils/helpers';
import IPaginationProductsDTO from '@modules/products/dtos/IPaginationProductsDTO';

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

  public async findAllInListDetailsPaginated({
    limit,
    page,
    type,
    date,
    order = 'ASC',
    sort_by,
    ...filter
  }: IPaginationInListDTO): Promise<IPaginatedProductsDTO> {
    const entity = type === 'offer' ? ListOffersDetail : ListProducersDetail;

    const skipped_items = (page - 1) * limit;

    const queryWhere = mountQueryWhereWithName(filter, 'product');

    const query = this.ormRepository
      .createQueryBuilder('product')
      .select(
        'product.*, ld.quantity_stock, ld.quantity_total, l.id as list_id, ld.id as list_offer_id',
      )
      .leftJoin(entity, 'ld', 'ld.product_id = product.id')
      .leftJoin(List, 'l', 'l.id = ld.list_id')
      .where(queryWhere)
      .andWhere(
        `'${date.toUTCString()}'
      BETWEEN "l"."start_date" AND "l"."end_date"`,
      )
      .orderBy(`product.${sort_by || 'created_at'}`, order)
      .offset(skipped_items)
      .limit(limit);

    const list_promise = this.ormRepository
      .createQueryBuilder('product')
      .select('l.* as id')
      .leftJoin(entity, 'ld', 'ld.product_id = product.id')
      .leftJoin(List, 'l', 'l.id = ld.list_id')
      .andWhere(
        `'${date.toUTCString()}'
      BETWEEN "l"."start_date" AND "l"."end_date"`,
      )
      .limit(1)
      .getRawMany();

    logger.info(query.getSql());

    const [products, total_count, list] = await Promise.all([
      query.getRawMany(),
      query.getCount(),
      list_promise,
    ]);

    return {
      limit,
      page,
      total_count,
      list: list[0],
      data: products,
    };
  }

  public async findAllPaginated({
    limit,
    page,
    order,
    sort_by,
    ...filter
  }: IPaginationProductsDTO): Promise<IPaginatedProductsDTO> {
    const skipped_items = (page - 1) * limit;

    const queryWhere = mountQueryWhereWithName(filter, 'products');

    const total_count = await this.ormRepository.count();
    const products = await this.ormRepository
      .createQueryBuilder('products')
      .orderBy(`products.${sort_by || 'created_at'}`, order)
      .where(queryWhere)
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
