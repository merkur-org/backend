export type IUnit = 'kg' | 'g' | 'l' | 'ml' | 'un' | 'ton';

export default interface ICreateProductDTO {
  name: string;
  unit: IUnit;
  cost_price: number;
  sale_price: number;
  image?: string;
  observation?: string;
  nutritional_information?: string;
  wholesale_price?: number;
}
