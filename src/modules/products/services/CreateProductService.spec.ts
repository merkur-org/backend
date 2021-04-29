import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';
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
      unit_buy: 'un',
      unit_sale: 'un',
      organic: true,
      highlights: false,
      fraction_buy: 1,
      fraction_sale: 1,
      wholesale_price: 0.6,
    });

    expect(product).toHaveProperty('id');
    expect(product.image).toBe(undefined);
  });

  it('should be able to create a new product with image', async () => {
    const product = await createProduct.execute({
      name: 'Alface Americana',
      cost_price: 0.5,
      sale_price: 0.75,
      image: 'image.png',
      unit_buy: 'un',
      unit_sale: 'un',
      organic: true,
      highlights: false,
      fraction_buy: 1,
      fraction_sale: 1,
      wholesale_price: 0.6,
    });

    expect(product).toHaveProperty('id');
    expect(product.image).toBe('image.png');
  });
  it('should not be able to create new product if producs already exists', async () => {
    await createProduct.execute({
      name: 'Alface Americana',
      cost_price: 0.5,
      sale_price: 0.75,
      unit_buy: 'un',
      unit_sale: 'un',
      organic: true,
      highlights: false,
      fraction_buy: 1,
      fraction_sale: 1,
      wholesale_price: 0.6,
    });

    await expect(
      createProduct.execute({
        name: 'Alface Americana',
        cost_price: 0.5,
        sale_price: 0.75,
        unit_buy: 'un',
        unit_sale: 'un',
        organic: true,
        highlights: false,
        fraction_buy: 1,
        fraction_sale: 1,
        wholesale_price: 0.6,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
