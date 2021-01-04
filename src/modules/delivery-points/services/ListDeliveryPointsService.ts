import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import PaginationDTO from '@shared/dtos/PaginationDTO';
import IDeliveryPointsRepository from '../repositories/IDeliveryPointsRepository';
import PaginatedDeliveryPointsDTO from '../dtos/PaginatedDeliveryPointsDTO';

interface IRequest {
  point_state: string;
}

@injectable()
class ListDeliveryPointsService {
  constructor(
    @inject('DeliveryPointsRepository')
    private deliveryPointsRepository: IDeliveryPointsRepository,
  ) {}

  public async execute(
    { point_state }: IRequest,
    { limit, page }: PaginationDTO,
  ): Promise<PaginatedDeliveryPointsDTO> {
    if (!point_state) {
      throw new AppError('Please inform the state');
    }

    const response = await this.deliveryPointsRepository.findAllPaginated(
      point_state,
      { limit, page },
    );

    return response;
  }
}

export default ListDeliveryPointsService;
