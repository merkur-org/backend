import { injectable, inject } from 'tsyringe';

import IProductsRepository from '../repositories/IProductsRepository';
import PaginatedProductDTO from '../dtos/IPaginatedProductsDTO';
import IPaginationProductsDTO from '../dtos/IPaginationProductsDTO';

@injectable()
class ListProductsService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute({
    limit,
    page,
    order,
    sort_by,
    ...filter
  }: IPaginationProductsDTO): Promise<PaginatedProductDTO> {
    const response = await this.productsRepository.findAllPaginated({
      limit,
      page,
      order,
      sort_by,
      ...filter,
    });

    return response;
  }
}

export default ListProductsService;
