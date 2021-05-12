import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';

import FakeProductsRepository from '../repositories/fakes/FakeProductsRepository';
import CreateProductService from './CreateProductService';
import DeleteProductService from './DeleteProductService';

let fakeProductsRepository: FakeProductsRepository;
let fakeStorageProvider: FakeStorageProvider;
let createProduct: CreateProductService;
let deleteProduct: DeleteProductService;

describe('DeleteProduct', () => {
  beforeEach(() => {
    fakeProductsRepository = new FakeProductsRepository();
    fakeStorageProvider = new FakeStorageProvider();

    createProduct = new CreateProductService(
      fakeProductsRepository,
      fakeStorageProvider,
    );
    deleteProduct = new DeleteProductService(fakeProductsRepository);
  });

  it('should be able to delete a product', async () => {
    const product = await createProduct.execute({
      name: 'Alface Crespa',
      cost_price: 0.5,
      sale_price: 0.75,
      unit_buy: 'bag',
      unit_sale: 'box',
      category: 'Proteínas',
      fraction_buy: 1,
      fraction_sale: 1,
      highlights: false,
      organic: true,
      wholesale_price: 0.6,
    });

    const message = await deleteProduct.execute({
      product_id: product.id,
    });

    expect(message).toHaveProperty('message');
  });

  it('should be able to delete the delivery point if the given ID does not exist', async () => {
    await expect(
      deleteProduct.execute({
        product_id: 'non-existing-product-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
