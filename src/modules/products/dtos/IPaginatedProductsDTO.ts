import List from '@modules/lists/infra/typeorm/entities/List';
import Product from '../infra/typeorm/entities/Product';

export default interface IPaginatedProductDTO {
  data: Product[];
  page: number;
  limit: number;
  list?: List;
  total_count: number;
}
