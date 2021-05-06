import { injectable, inject } from 'tsyringe';

import IProductsRepository from '../repositories/IProductsRepository';
import PaginatedProductDTO from '../dtos/IPaginatedProductsDTO';
import IPaginationInListDTO from '../dtos/IPaginationInListDTO';

@injectable()
class ListProductsInListService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute({
    limit,
    page,
    type,
    date,
    order = 'ASC',
    sort_by,
    ...filter
  }: IPaginationInListDTO): Promise<PaginatedProductDTO> {
    const response = await this.productsRepository.findAllInListDetailsPaginated(
      {
        limit,
        page,
        type,
        date,
        order,
        sort_by,
        ...filter,
      },
    );

    return response;
  }
}

export default ListProductsInListService;
