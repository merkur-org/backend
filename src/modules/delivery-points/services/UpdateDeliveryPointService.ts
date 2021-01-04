import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IDeliveryPointsRepository from '../repositories/IDeliveryPointsRepository';
import DeliveryPoint from '../infra/typeorm/entities/DeliveryPoints';

interface IRequest {
  point_id: string;
  city: string;
  state: string;
  suburb: string;
  street: string;
  cep: number;
  number: number;
  latitude: number;
  longitude: number;
}

@injectable()
class UpdateDeliveryPointService {
  constructor(
    @inject('DeliveryPointsRepository')
    private deliveryPointsRepository: IDeliveryPointsRepository,
  ) {}

  public async execute({
    point_id,
    city,
    state,
    suburb,
    street,
    cep,
    number,
    latitude,
    longitude,
  }: IRequest): Promise<DeliveryPoint> {
    const point = await this.deliveryPointsRepository.findByID(point_id);

    if (!point) {
      throw new AppError('Delivery Point not found');
    }

    return point;
  }
}

export default UpdateDeliveryPointService;
