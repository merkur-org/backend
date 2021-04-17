import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeProductsRepository from '../repositories/fakes/FakeProductsRepository';
import ShowProductService from './ShowProductService';
import CreateProductService from './CreateProductService';

let fakeProductsRepository: FakeProductsRepository;
let fakeStorageProvider: FakeStorageProvider;
let showProduct: ShowProductService;
let createProduct: CreateProductService;

describe('ShowProduct', () => {
  beforeEach(() => {
    fakeProductsRepository = new FakeProductsRepository();
    fakeStorageProvider = new FakeStorageProvider();

    createProduct = new CreateProductService(
      fakeProductsRepository,
      fakeStorageProvider,
    );
    showProduct = new ShowProductService(fakeProductsRepository);
  });

  it('should be able to show the product', async () => {
    const createdProduct = await createProduct.execute({
      name: 'Laranja Lima',
      cost_price: 4,
      sale_price: 6,
      unit: 'kg',
      wholesale_price: 5.5,
    });

    const product = await showProduct.execute({
      product_id: createdProduct.id,
    });

    expect(product.name).toBe('Laranja Lima');
  });
});
