import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IDeliveryPointsRepository from '../repositories/IDeliveryPointsRepository';
import DeliveryPoint from '../infra/typeorm/entities/DeliveryPoints';

interface IRequest {
  point_id: string;
}

@injectable()
class ShowDeliveryPointService {
  constructor(
    @inject('DeliveryPointsRepository')
    private deliveryPointsRepository: IDeliveryPointsRepository,
  ) {}

  public async execute({ point_id }: IRequest): Promise<DeliveryPoint> {
    const point = await this.deliveryPointsRepository.findByID(point_id);

    if (!point) {
      throw new AppError('Delivery Point not found');
    }

    return point;
  }
}

export default ShowDeliveryPointService;
