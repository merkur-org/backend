import IPaginationDTO from '@shared/dtos/IPaginationDTO';
import ICreateProductDTO from '../dtos/ICreateProductDTO';
import IPaginatedProductsDTO from '../dtos/IPaginatedProductsDTO';
import IPaginationInListDTO from '../dtos/IPaginationInListDTO';
import IPaginationProductsDTO from '../dtos/IPaginationProductsDTO';
import Product from '../infra/typeorm/entities/Product';

export default interface IProductsRepository {
  findById(id: string): Promise<Product | undefined>;
  findExistingProduct(name: string): Promise<Product | undefined>;
  findByName(data: IPaginationDTO): Promise<IPaginatedProductsDTO>;
  create(data: ICreateProductDTO): Promise<Product>;
  delete(id: string): Promise<void>;
  save(data: ICreateProductDTO): Promise<Product>;
  findAllPaginated(
    data: IPaginationProductsDTO,
  ): Promise<IPaginatedProductsDTO>;
  findAllInListDetailsPaginated(
    data: IPaginationInListDTO,
  ): Promise<IPaginatedProductsDTO>;
}
