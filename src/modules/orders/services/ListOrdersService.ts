import { injectable, inject } from 'tsyringe';

import IPaginationDTO from '@shared/dtos/IPaginationDTO';
import IOrdersRepository from '../repositories/IOrdersRepository';
import PaginatedOrdersDTO from '../dtos/IPaginatedOrdersDTO';

@injectable()
class ListOrdersService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
  ) {}

  public async execute({
    limit,
    page,
  }: IPaginationDTO): Promise<PaginatedOrdersDTO> {
    const response = await this.ordersRepository.findAllPaginated({
      limit,
      page,
    });

    return response;
  }
}

export default ListOrdersService;
