import { getRepository, Repository } from 'typeorm';

import DeliveryPoint from '@modules/delivery-points/infra/typeorm/entities/DeliveryPoints';
import ICreateDeliveryPointDTO from '@modules/delivery-points/dtos/ICreateDeliveryPointDTO';
import IDeliveryPointsRepository from '@modules/delivery-points/repositories/IDeliveryPointsRepository';
import IPaginatedDeliveryPointsDTO from '@modules/delivery-points/dtos/IPaginatedDeliveryPointsDTO';
import IPaginationDeliveryPointDTO from '@modules/delivery-points/dtos/IPaginationDeliveryPointDTO';
import { mountQueryWhere } from '@shared/utils/helpers';

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

  public async findAllPaginated({
    limit,
    page,
    sort_by,
    order,
    ...filter
  }: IPaginationDeliveryPointDTO): Promise<IPaginatedDeliveryPointsDTO> {
    const skipped_items = (page - 1) * limit;

    const queryWhere = mountQueryWhere(filter, 'delivery_points');

    const [points, total_count] = await this.ormRepository
      .createQueryBuilder('delivery_points')
      .where(queryWhere)
      .orderBy(`delivery_points.${sort_by || 'created_at'}`, order)
      .offset(skipped_items)
      .limit(limit)
      .getManyAndCount();

    return {
      total_count,
      page,
      limit,
      data: points,
    };
  }
}

export default DeliveryPointsRepository;
