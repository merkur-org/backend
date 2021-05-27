import { injectable, inject } from 'tsyringe';

import IOrdersRepository from '../repositories/IOrdersRepository';
import IPaginatedOrdersDTO from '../dtos/IPaginatedOrdersDTO';
import IPaginationOrdersDTO from '../dtos/IPaginationOrdersDTO';

@injectable()
class ListOrdersService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
  ) {}

  public async execute({
    limit,
    order,
    sort_by,
    page,
    ...filter
  }: IPaginationOrdersDTO): Promise<IPaginatedOrdersDTO> {
    const response = await this.ordersRepository.findAllPaginated({
      limit,
      order,
      sort_by,
      page,
      ...filter,
    });

    return response;
  }
}

export default ListOrdersService;
