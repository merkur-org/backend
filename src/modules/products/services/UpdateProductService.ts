import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IProductsRepository from '../repositories/IProductsRepository';
import Product, { ICategory, IUnit } from '../infra/typeorm/entities/Product';

interface IRequest {
  product_id: string;
  name?: string;
  unit_sale?: IUnit;
  unit_buy?: IUnit;
  category?: ICategory;
  fraction_buy?: number;
  fraction_sale?: number;
  cost_price?: number;
  sale_price?: number;
  highlights?: boolean;
  organic?: boolean;
  wholesale_price?: number;
  observation?: string;
  nutritional_information?: string;
}

@injectable()
class UpdateProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute({
    product_id,
    name,
    cost_price,
    sale_price,
    unit_buy,
    fraction_buy,
    fraction_sale,
    unit_sale,
    wholesale_price,
    nutritional_information,
    observation,
    category,
    highlights,
    organic,
  }: IRequest): Promise<Product> {
    const foundProduct = await this.productsRepository.findById(product_id);

    if (!foundProduct) {
      throw new AppError('Product does not exist', 404);
    }

    foundProduct.name = name || foundProduct.name;
    foundProduct.unit_buy = unit_buy || foundProduct.unit_buy;
    foundProduct.unit_sale = unit_sale || foundProduct.unit_sale;
    foundProduct.category = category || foundProduct.category;
    foundProduct.fraction_buy = fraction_buy || foundProduct.fraction_buy;
    foundProduct.fraction_sale = fraction_sale || foundProduct.fraction_sale;
    foundProduct.cost_price = cost_price || foundProduct.cost_price;
    foundProduct.sale_price = sale_price || foundProduct.sale_price;
    foundProduct.wholesale_price =
      wholesale_price || foundProduct.wholesale_price;
    foundProduct.updated_at = new Date();
    foundProduct.nutritional_information =
      nutritional_information || foundProduct.nutritional_information;
    foundProduct.observation = observation || foundProduct.observation;
    foundProduct.highlights = highlights || false;
    foundProduct.organic = organic || false;

    console.log(foundProduct.organic);

    await this.productsRepository.save(foundProduct);

    return foundProduct;
  }
}

export default UpdateProductService;
