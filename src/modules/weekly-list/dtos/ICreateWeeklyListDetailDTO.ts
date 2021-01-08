import Product from '@modules/products/infra/typeorm/entities/Product';
import WeeklyList from '../infra/typeorm/entities/WeeklyList';

export default interface ICreateWeeklyListDetailDTO {
  weekly_list: WeeklyList;
  products: Product[];
  total_price: number;
}
