import { injectable, inject } from 'tsyringe';

import IPaginationDTO from '@shared/dtos/IPaginationDTO';
import IDeliveryPointsRepository from '../repositories/IDeliveryPointsRepository';
import PaginatedDeliveryPointsDTO from '../dtos/PaginatedDeliveryPointsDTO';

interface IRequest extends IPaginationDTO {
  point_state: string;
}

@injectable()
class ListDeliveryPointsService {
  constructor(
    @inject('DeliveryPointsRepository')
    private deliveryPointsRepository: IDeliveryPointsRepository,
  ) {}

  public async execute({
    point_state,
    limit,
    page,
  }: IRequest): Promise<PaginatedDeliveryPointsDTO> {
    const response = await this.deliveryPointsRepository.findAllPaginated(
      point_state,
      { limit, page },
    );

    return response;
  }
}

export default ListDeliveryPointsService;
