import IPaginationDTO from '@shared/dtos/IPaginationDTO';
import ICreateProductDTO from '../dtos/ICreateProductDTO';
import IPaginatedProductsDTO from '../dtos/IPaginatedProductsDTO';
import Product from '../infra/typeorm/entities/Product';

export default interface IProductsRepository {
  findById(id: string): Promise<Product | undefined>;
  findExistingProduct(name: string): Promise<Product | undefined>;
  findByName(name: string): Promise<Product[] | undefined>;
  create(data: ICreateProductDTO): Promise<Product>;
  delete(id: string): Promise<void>;
  save(data: ICreateProductDTO): Promise<Product>;
  findAllPaginated(data: IPaginationDTO): Promise<IPaginatedProductsDTO>;
}
