import { injectable, inject } from 'tsyringe';

import IPaginationDTO from '@shared/dtos/IPaginationDTO';
import IOrdersRepository from '../repositories/IOrdersRepository';
import PaginatedOrdersDTO from '../dtos/IPaginatedOrdersDTO';

interface IRequest extends IPaginationDTO {
  user_id: string;
}

@injectable()
class ListHistoryOrdersByUserIdService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
  ) {}

  public async execute({
    user_id,
    limit,
    page,
  }: IRequest): Promise<PaginatedOrdersDTO> {
    const response = await this.ordersRepository.findByUserId({
      user_id,
      limit,
      page,
    });

    return response;
  }
}

export default ListHistoryOrdersByUserIdService;
