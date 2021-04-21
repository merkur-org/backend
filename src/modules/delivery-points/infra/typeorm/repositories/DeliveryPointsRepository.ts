import { getRepository, Repository } from 'typeorm';

import DeliveryPoint from '@modules/delivery-points/infra/typeorm/entities/DeliveryPoints';
import ICreateDeliveryPointDTO from '@modules/delivery-points/dtos/ICreateDeliveryPointDTO';
import IDeliveryPointsRepository from '@modules/delivery-points/repositories/IDeliveryPointsRepository';
import IPaginationDTO from '@shared/dtos/IPaginationDTO';
import PaginatedDeliveryPointsDTO from '@modules/delivery-points/dtos/PaginatedDeliveryPointsDTO';

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

  public async findAllPaginated(
    state: string,
    { limit, page }: IPaginationDTO,
  ): Promise<PaginatedDeliveryPointsDTO> {
    const skipped_items = (page - 1) * limit;

    const total_count = await this.ormRepository.count();
    const points = await this.ormRepository
      .createQueryBuilder('delivery_points')
      .where('delivery_points.state = :state', { state })
      .orderBy('created_at', 'DESC')
      .offset(skipped_items)
      .limit(limit)
      .getMany();

    return {
      total_count,
      page,
      limit,
      data: points,
    };
  }
}

export default DeliveryPointsRepository;
