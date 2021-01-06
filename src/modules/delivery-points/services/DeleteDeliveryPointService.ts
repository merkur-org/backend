import { injectable, inject } from 'tsyringe';

import { IRole } from '@modules/users/dtos/ICreateUserDTO';
import AppError from '@shared/errors/AppError';
import IDeliveryPointsRepository from '../repositories/IDeliveryPointsRepository';

interface IRequest {
  point_id: string;
  role: IRole;
}

@injectable()
class DeleteDeliveryPointService {
  constructor(
    @inject('DeliveryPointsRepository')
    private deliveryPointsRepository: IDeliveryPointsRepository,
  ) {}

  public async execute({ point_id }: IRequest): Promise<{ message: string }> {
    const point = await this.deliveryPointsRepository.findByID(point_id);

    if (!point) {
      throw new AppError('Delivery Point not found');
    }

    await this.deliveryPointsRepository.delete(point_id);

    return { message: 'delivery point deleted' };
  }
}

export default DeleteDeliveryPointService;
