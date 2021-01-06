import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import { IRole } from '@modules/users/dtos/ICreateUserDTO';
import IDeliveryPointsRepository from '../repositories/IDeliveryPointsRepository';
import DeliveryPoint from '../infra/typeorm/entities/DeliveryPoints';
import ICreateDeliveryPointDTO from '../dtos/ICreateDeliveryPointDTO';

interface IRequest extends ICreateDeliveryPointDTO {
  point_id: string;
  role: IRole;
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
    role,
  }: IRequest): Promise<DeliveryPoint> {
    if (!role.match(/r|a/g)) {
      throw new AppError('You dont have permission to do this action', 401);
    }

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
