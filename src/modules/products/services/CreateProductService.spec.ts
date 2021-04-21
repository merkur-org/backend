import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeProductsRepository from '../repositories/fakes/FakeProductsRepository';
import CreateProductService from './CreateProductService';

let fakeProductsRepository: FakeProductsRepository;
let fakeStorageProvider: FakeStorageProvider;
let createProduct: CreateProductService;

describe('CreateProduct', () => {
  beforeEach(() => {
    fakeProductsRepository = new FakeProductsRepository();
    fakeStorageProvider = new FakeStorageProvider();

    createProduct = new CreateProductService(
      fakeProductsRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to create a new product', async () => {
    const product = await createProduct.execute({
      name: 'Alface Americana',
      cost_price: 0.5,
      sale_price: 0.75,
      unit: 'un',
      wholesale_price: 0.6,
    });

    expect(product).toHaveProperty('id');
  });
});
