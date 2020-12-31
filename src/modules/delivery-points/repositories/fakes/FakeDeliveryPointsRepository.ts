import { uuid } from 'uuidv4';

import DeliveryPoint from '@modules/delivery-points/infra/typeorm/entities/DeliveryPoints';
import ICreateDeliveryPointDTO from '@modules/delivery-points/dtos/ICreateDeliveryPointDTO';
import IDeliveryPointsRepository from '../IDeliveryPointsRepository';

class FakeDeliveryPointsRepository implements IDeliveryPointsRepository {
  private deliveryPoints: DeliveryPoint[] = [];

  public async findByID(id: string): Promise<DeliveryPoint | undefined> {
    const findPoint = this.deliveryPoints.find(point => point.id === id);

    return findPoint;
  }

  public async create(data: ICreateDeliveryPointDTO): Promise<DeliveryPoint> {
    const deliveryPoint = new DeliveryPoint();

    Object.assign(deliveryPoint, { id: uuid }, data);

    this.deliveryPoints.push(deliveryPoint);

    return deliveryPoint;
  }

  public async delete(id: string): Promise<void> {
    this.deliveryPoints.filter(point => point.id !== id);
  }

  public async save(point: DeliveryPoint): Promise<DeliveryPoint> {
    const findIndex = this.deliveryPoints.findIndex(
      findPoint => findPoint.id === point.id,
    );

    this.deliveryPoints[findIndex] = point;

    return point;
  }
}

export default FakeDeliveryPointsRepository;
