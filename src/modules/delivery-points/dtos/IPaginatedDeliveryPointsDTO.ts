import DeliveryPoints from '../infra/typeorm/entities/DeliveryPoints';

export default interface IPaginatedDeliveryPointsDTO {
  data: DeliveryPoints[];
  page: number;
  limit: number;
  total_count: number;
}
