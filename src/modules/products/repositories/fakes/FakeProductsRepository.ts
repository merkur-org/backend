import { v4 as uuid } from 'uuid';

import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import Product from '@modules/products/infra/typeorm/entities/Product';
import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import IPaginationDTO from '@shared/dtos/IPaginationDTO';
import IPaginatedProductsDTO from '@modules/products/dtos/IPaginatedProductsDTO';

class FakeProductsRepository implements IProductsRepository {
  private products: Product[] = [];

  public async findById(id: string): Promise<Product | undefined> {
    const findProduct = this.products.find(product => product.id === id);

    return findProduct;
  }

  public async findExistingProduct(name: string): Promise<Product | undefined> {
    const findProduct = this.products.find(
      product => product.name.toLowerCase() === name.toLowerCase(),
    );
    return findProduct;
  }

  public async findByName({
    limit,
    page,
    name,
  }: IPaginationDTO): Promise<IPaginatedProductsDTO> {
    const skipped_items = (page - 1) * limit;
    const productsArray = this.products.filter(
      p => p.name.toLowerCase() === String(name).toLowerCase(),
    );
    const total_count = this.products.length;
    const products: Product[] = [];

    let i = skipped_items;

    const limitLoop =
      skipped_items + limit < total_count ? skipped_items + limit : total_count - 1;

    if (
      i === 0 &&
      limitLoop === 0 &&
      productsArray[0] &&
      productsArray[0].name.toLowerCase() === String(name).toLowerCase()
    ) {
      products.push(productsArray[0]);
    }
    // eslint-disable-next-line no-plusplus
    for (i; i < limitLoop; i++) {
      products.push(productsArray[i]);
    }

    return {
      total_count,
      page,
      limit,
      data: products,
    };
  }

  public async create(data: ICreateProductDTO): Promise<Product> {
    const product = new Product();

    Object.assign(product, { ...data }, { id: uuid() });

    this.products.push(product);

    return product;
  }

  public async delete(id: string): Promise<void> {
    this.products = this.products.filter(product => product.id !== id);
  }

  public async save(product: Product): Promise<Product> {
    const findIndex = this.products.findIndex(
      findProduct => findProduct.id === product.id,
    );

    this.products[findIndex] = product;

    return product;
  }

  public async findAllPaginated({
    page,
    limit,
  }: IPaginationDTO): Promise<IPaginatedProductsDTO> {
    const skipped_items = (page - 1) * limit;

    const total_count = this.products.length;
    const products: Product[] = [];

    let i = skipped_items;

    const limitLoop =
      skipped_items + limit < total_count ? skipped_items + limit : total_count - 1;

    if (i === 0 && limitLoop === 0 && this.products[0]) {
      products.push(this.products[0]);
    }
    // eslint-disable-next-line no-plusplus
    for (i; i < limitLoop; i++) {
      products.push(this.products[i]);
    }

    return {
      total_count,
      page,
      limit,
      data: products,
    };
  }
}

export default FakeProductsRepository;
