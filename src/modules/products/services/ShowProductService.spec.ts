import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';
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
      unit_sale: 'kg',
      unit_buy: 'kg',
      fraction_buy: 1,
      fraction_sale: 1,
      highlights: true,
      organic: true,
      wholesale_price: 5.5,
      category: 'Legumes',
    });

    const product = await showProduct.execute({
      product_id: createdProduct.id,
    });

    expect(product.name).toBe('Laranja Lima');
  });
  it('should not be able to show the product if product not exists', async () => {
    await expect(
      showProduct.execute({
        product_id: 'non-exists',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
