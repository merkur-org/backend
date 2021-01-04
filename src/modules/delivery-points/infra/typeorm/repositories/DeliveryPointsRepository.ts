import { getRepository, Repository } from 'typeorm';

import DeliveryPoint from '@modules/delivery-points/infra/typeorm/entities/DeliveryPoints';
import ICreateDeliveryPointDTO from '@modules/delivery-points/dtos/ICreateDeliveryPointDTO';
import IDeliveryPointsRepository from '@modules/delivery-points/repositories/IDeliveryPointsRepository';

class DeliveryPointsRepository implements IDeliveryPointsRepository {
  private ormRepository: Repository<DeliveryPoint>;

  constructor() {
    this.ormRepository = getRepository(DeliveryPoint);
  }

  public async findByID(id: string): Promise<DeliveryPoint | undefined> {
    const findPoint = await this.ormRepository.findOne(id);

    return findPoint;
  }

  public async create(data: ICreateDeliveryPointDTO): Promise<DeliveryPoint> {
    const point = this.ormRepository.create(data);

    await this.ormRepository.save(point);

    return point;
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete({ id });
  }

  public async save(point: DeliveryPoint): Promise<DeliveryPoint> {
    return this.ormRepository.save(point);
  }
}

export default DeliveryPointsRepository;
