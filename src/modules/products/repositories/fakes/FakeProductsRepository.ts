import { uuid } from 'uuidv4';

import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import Product from '@modules/products/infra/typeorm/entities/Product';
import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import PaginatedProductDTO from '@modules/products/dtos/PaginatedProductsDTO';
import PaginationDTO from '@shared/dtos/PaginationDTO';

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

  public async findByName(name: string): Promise<Product[] | undefined> {
    const findProduct = this.products.filter(product =>
      product.name.toLowerCase().includes(name.toLowerCase()),
    );
    return findProduct;
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
  }: PaginationDTO): Promise<PaginatedProductDTO> {
    const skippedItems = (page - 1) * limit;

    const totalCount = this.products.length;
    const products: Product[] = [];

    let i = skippedItems;

    const limitLoop =
      skippedItems + limit < totalCount ? skippedItems + limit : totalCount - 1;

    if (i === 0 && limitLoop === 0 && this.products[0]) {
      products.push(this.products[0]);
    }
    // eslint-disable-next-line no-plusplus
    for (i; i < limitLoop; i++) {
      products.push(this.products[i]);
    }

    return {
      totalCount,
      page,
      limit,
      data: products,
    };
  }
}

export default FakeProductsRepository;
