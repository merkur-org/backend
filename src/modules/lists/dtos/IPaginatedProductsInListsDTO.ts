import Product from '@modules/products/infra/typeorm/entities/Product';

export default interface IPaginatedProductsInListsDTO {
  products: Product[];
  page: number;
  limit: number;
  total_count: number;
}
