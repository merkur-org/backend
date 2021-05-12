import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeProductsRepository from '../repositories/fakes/FakeProductsRepository';
import ListProductsService from './ListProductsService';
import CreateProductService from './CreateProductService';

let fakeProductsRepository: FakeProductsRepository;
let fakeStorageProvider: FakeStorageProvider;
let listProducts: ListProductsService;
let createProduct: CreateProductService;

describe('ListProducts', () => {
  beforeEach(() => {
    fakeProductsRepository = new FakeProductsRepository();
    fakeStorageProvider = new FakeStorageProvider();

    createProduct = new CreateProductService(
      fakeProductsRepository,
      fakeStorageProvider,
    );
    listProducts = new ListProductsService(fakeProductsRepository);
  });

  it('should be able to list the products', async () => {
    await createProduct.execute({
      name: 'Batata Inglesa',
      cost_price: 8,
      sale_price: 12,
      unit_sale: 'kg',
      unit_buy: 'kg',
      fraction_buy: 1,
      fraction_sale: 1,
      highlights: true,
      organic: true,
      wholesale_price: 10,
      category: 'Proteínas',
    });

    await createProduct.execute({
      name: 'Batata Doce',
      cost_price: 6,
      sale_price: 9,
      unit_sale: 'kg',
      unit_buy: 'kg',
      fraction_buy: 1,
      fraction_sale: 1,
      highlights: true,
      organic: true,
      wholesale_price: 7.5,
      category: 'Legumes',
    });

    await createProduct.execute({
      name: 'Banana',
      cost_price: 0.75,
      sale_price: 1.2,
      category: 'Legumes',
      unit_sale: 'kg',
      unit_buy: 'kg',
      fraction_buy: 1,
      fraction_sale: 1,
      highlights: true,
      organic: true,
      wholesale_price: 0.9,
    });

    const products = await listProducts.execute({
      limit: 10,
      page: 1,
    });

    expect(products.data.length).toBe(2);
    expect(products.limit).toBe(10);
    expect(products.page).toBe(1);
    expect(products.total_count).toBe(3);
  });
});
