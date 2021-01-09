import Product from '../infra/typeorm/entities/Product';

export default interface PaginatedProductDTO {
  data: Product[];
  page: number;
  limit: number;
  totalCount: number;
}
