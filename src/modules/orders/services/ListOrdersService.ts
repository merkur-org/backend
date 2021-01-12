import { injectable, inject } from 'tsyringe';

import IPaginationDTO from '@shared/dtos/IPaginationDTO';
import AppError from '@shared/errors/AppError';
import IOrdersRepository from '../repositories/IOrdersRepository';
import PaginatedOrdersDTO from '../dtos/IPaginatedOrdersDTO';

interface IRequest extends IPaginationDTO {
  user_id: string;
}

@injectable()
class ListOrdersService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
  ) {}

  public async execute({
    user_id,
    limit,
    page,
  }: IRequest): Promise<PaginatedOrdersDTO> {
    const foundOrders = await this.ordersRepository.findByUserId(user_id);

    if (!foundOrders || foundOrders.length === 0) {
      throw new AppError('Orders not found', 404);
    }

    const response = await this.ordersRepository.findAllPaginated({
      user_id,
      limit,
      page,
    });

    return response;
  }
}

export default ListOrdersService;
