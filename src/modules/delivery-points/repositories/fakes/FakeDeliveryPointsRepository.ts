import { v4 as uuid } from 'uuid';

import DeliveryPoint from '@modules/delivery-points/infra/typeorm/entities/DeliveryPoints';
import ICreateDeliveryPointDTO from '@modules/delivery-points/dtos/ICreateDeliveryPointDTO';
import IPaginationDTO from '@shared/dtos/IPaginationDTO';
import PaginatedDeliveryPointsDTO from '@modules/delivery-points/dtos/PaginatedDeliveryPointsDTO';
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

  public async findAllPaginated(
    state: string,
    { page, limit }: IPaginationDTO,
  ): Promise<PaginatedDeliveryPointsDTO> {
    const skipped_items = (page - 1) * limit;

    const total_count = this.deliveryPoints.length;
    const points: DeliveryPoint[] = [];

    let i = skipped_items;

    const limitLoop =
      skipped_items + limit < total_count
        ? skipped_items + limit
        : total_count - 1;

    if (i === 0 && limitLoop === 0 && this.deliveryPoints[0]) {
      points.push(this.deliveryPoints[0]);
    }
    // eslint-disable-next-line no-plusplus
    for (i; i < limitLoop; i++) {
      points.push(this.deliveryPoints[i]);
    }

    return {
      total_count,
      page,
      limit,
      data: points,
    };
  }
}

export default FakeDeliveryPointsRepository;
