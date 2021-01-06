import DeliveryPoint from '@modules/delivery-points/infra/typeorm/entities/DeliveryPoints';
import PaginationDTO from '@shared/dtos/PaginationDTO';
import PaginatedDeliveryPointsDTO from '@modules/delivery-points/dtos/PaginatedDeliveryPointsDTO';
import ICreateDeliveryPointDTO from '../dtos/ICreateDeliveryPointDTO';

export default interface IDeliveryPointsRepository {
  findByID(id: string): Promise<DeliveryPoint | undefined>;
  create(data: ICreateDeliveryPointDTO): Promise<DeliveryPoint>;
  delete(id: string): Promise<void>;
  save(point: DeliveryPoint): Promise<DeliveryPoint>;
  findAllPaginated(
    state: string,
    data: PaginationDTO,
  ): Promise<PaginatedDeliveryPointsDTO>;
}
