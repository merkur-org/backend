import { injectable, inject } from 'tsyringe';

import PaginationDTO from '@shared/dtos/PaginationDTO';
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
  }: PaginationDTO): Promise<PaginatedProductDTO> {
    const response = await this.productsRepository.findAllPaginated({
      limit,
      page,
    });

    return response;
  }
}

export default ListProductsService;
