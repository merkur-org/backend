import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IDeliveryPointsRepository from '../repositories/IDeliveryPointsRepository';
import DeliveryPoint from '../infra/typeorm/entities/DeliveryPoints';
import ICreateDeliveryPointDTO from '../dtos/ICreateDeliveryPointDTO';

interface IRequest extends ICreateDeliveryPointDTO {
  point_id: string;
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

    point.city = city;
    point.state = state;
    point.suburb = suburb;
    point.street = street;
    point.cep = cep;
    point.number = number;
    point.latitude = latitude;
    point.longitude = longitude;

    await this.deliveryPointsRepository.save(point);

    return point;
  }
}

export default UpdateDeliveryPointService;
