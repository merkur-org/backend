import Order from '../infra/typeorm/entities/Order';

export default interface IPaginatedDeliveryPointsDTO {
  data: Order[];
  page: number;
  limit: number;
  total_count: number;
}
