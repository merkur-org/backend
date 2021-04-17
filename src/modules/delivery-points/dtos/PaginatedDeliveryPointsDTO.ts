import DeliveryPoints from '../infra/typeorm/entities/DeliveryPoints';

export default interface PaginatedDeliveryPointsDTO {
  data: DeliveryPoints[];
  page: number;
  limit: number;
  total_count: number;
}
