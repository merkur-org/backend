import { ICategory, IUnit } from '../infra/typeorm/entities/Product';

export default interface ICreateProductDTO {
  name: string;
  unit_sale: IUnit;
  unit_buy: IUnit;
  category: ICategory;
  fraction_buy: number;
  fraction_sale: number;
  cost_price: number;
  sale_price: number;
  highlights: boolean;
  organic: boolean;
  image?: string;
  observation?: string;
  nutritional_information?: string;
  wholesale_price?: number;
}
