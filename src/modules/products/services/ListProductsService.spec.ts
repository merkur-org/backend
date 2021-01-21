import FakeProductsRepository from '../repositories/fakes/FakeProductsRepository';
import ListProductsService from './ListProductsService';
import CreateProductService from './CreateProductService';

let fakeProductsRepository: FakeProductsRepository;
let listProducts: ListProductsService;
let createProduct: CreateProductService;

describe('ListProducts', () => {
  beforeEach(() => {
    fakeProductsRepository = new FakeProductsRepository();

    createProduct = new CreateProductService(fakeProductsRepository);
    listProducts = new ListProductsService(fakeProductsRepository);
  });

  it('should be able to list the products', async () => {
    await createProduct.execute({
      name: 'Batata Inglesa',
      cost_price: 8,
      sale_price: 12,
      unit: 'kg',
      wholesale_price: 10,
    });

    await createProduct.execute({
      name: 'Batata Doce',
      cost_price: 6,
      sale_price: 9,
      unit: 'kg',
      wholesale_price: 7.5,
    });

    await createProduct.execute({
      name: 'Banana',
      cost_price: 0.75,
      sale_price: 1.2,
      unit: 'un',
      wholesale_price: 0.9,
    });

    const products = await listProducts.execute({
      limit: 10,
      page: 1,
    });

    expect(products.data.length).toBe(1);
    expect(products.limit).toBe(10);
    expect(products.page).toBe(1);
    expect(products.totalCount).toBe(1);
  });
});
