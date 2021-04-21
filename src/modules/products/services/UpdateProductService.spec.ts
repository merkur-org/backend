import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';

import FakeProductsRepository from '../repositories/fakes/FakeProductsRepository';
import CreateProductService from './CreateProductService';
import UpdateProductService from './UpdateProductService';

let fakeProductsRepository: FakeProductsRepository;
let fakeStorageProvider: FakeStorageProvider;
let createProduct: CreateProductService;
let updateProduct: UpdateProductService;

describe('UpdateProduct', () => {
  beforeEach(() => {
    fakeProductsRepository = new FakeProductsRepository();
    fakeStorageProvider = new FakeStorageProvider();

    createProduct = new CreateProductService(
      fakeProductsRepository,
      fakeStorageProvider,
    );
    updateProduct = new UpdateProductService(fakeProductsRepository);
  });

  it('should be able to update the product', async () => {
    const product = await createProduct.execute({
      name: 'Limão Galego',
      cost_price: 12,
      sale_price: 14,
      unit: 'kg',
      wholesale_price: 12.75,
    });

    const updatedProduct = await updateProduct.execute({
      product_id: product.id,
      name: 'Limão Galego',
      cost_price: 10,
      sale_price: 13,
      unit: 'kg',
      wholesale_price: 12,
    });

    expect(updatedProduct.cost_price).toBe(10);
    expect(updatedProduct.sale_price).toBe(13);
    expect(updatedProduct.wholesale_price).toBe(12);
  });

  it('should not be able to show a product from non-existing product', async () => {
    await expect(
      updateProduct.execute({
        product_id: 'non-existing-product-id',
        name: 'Limão Galego',
        cost_price: 12,
        sale_price: 14,
        unit: 'kg',
        wholesale_price: 12.75,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
