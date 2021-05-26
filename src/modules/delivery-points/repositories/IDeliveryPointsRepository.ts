import DeliveryPoint from '@modules/delivery-points/infra/typeorm/entities/DeliveryPoints';
import IPaginatedDeliveryPointsDTO from '@modules/delivery-points/dtos/IPaginatedDeliveryPointsDTO';
import ICreateDeliveryPointDTO from '../dtos/ICreateDeliveryPointDTO';
import IPaginationDeliveryPointDTO from '../dtos/IPaginationDeliveryPointDTO';

export default interface IDeliveryPointsRepository {
  findByID(id: string): Promise<DeliveryPoint | undefined>;
  create(data: ICreateDeliveryPointDTO): Promise<DeliveryPoint>;
  delete(id: string): Promise<void>;
  save(point: DeliveryPoint): Promise<DeliveryPoint>;
  findAllPaginated(
    data: IPaginationDeliveryPointDTO,
  ): Promise<IPaginatedDeliveryPointsDTO>;
}
