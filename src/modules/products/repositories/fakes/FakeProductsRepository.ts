import { uuid } from 'uuidv4';

import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import Product from '@modules/products/infra/typeorm/entities/Product';
import IProductsRepository from '@modules/products/repositories/IProductsRepository';

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
}

export default FakeProductsRepository;
