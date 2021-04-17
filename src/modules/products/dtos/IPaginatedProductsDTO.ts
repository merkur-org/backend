import Product from '../infra/typeorm/entities/Product';

export default interface IPaginatedProductDTO {
  data: Product[];
  page: number;
  limit: number;
  total_count: number;
}
