import { injectable, inject } from 'tsyringe';

import IDeliveryPointsRepository from '../repositories/IDeliveryPointsRepository';
import IPaginatedDeliveryPointsDTO from '../dtos/IPaginatedDeliveryPointsDTO';
import IPaginationDeliveryPointDTO from '../dtos/IPaginationDeliveryPointDTO';

@injectable()
class ListDeliveryPointsService {
  constructor(
    @inject('DeliveryPointsRepository')
    private deliveryPointsRepository: IDeliveryPointsRepository,
  ) {}

  public async execute({
    limit,
    order,
    sort_by,
    page,
    ...filter
  }: IPaginationDeliveryPointDTO): Promise<IPaginatedDeliveryPointsDTO> {
    const response = await this.deliveryPointsRepository.findAllPaginated({
      limit,
      order,
      sort_by,
      page,
      ...filter,
    });

    return response;
  }
}

export default ListDeliveryPointsService;
