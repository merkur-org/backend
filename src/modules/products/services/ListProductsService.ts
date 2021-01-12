import { injectable, inject } from 'tsyringe';

import IPaginationDTO from '@shared/dtos/IPaginationDTO';
import IProductsRepository from '../repositories/IProductsRepository';
import PaginatedProductDTO from '../dtos/PaginatedProductsDTO';

@injectable()
class ListProductsService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute({
    limit,
    page,
  }: IPaginationDTO): Promise<PaginatedProductDTO> {
    const response = await this.productsRepository.findAllPaginated({
      limit,
      page,
    });

    return response;
  }
}

export default ListProductsService;
