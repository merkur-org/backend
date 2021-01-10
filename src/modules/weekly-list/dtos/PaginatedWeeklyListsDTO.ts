import WeeklyList from '../infra/typeorm/entities/WeeklyList';

export default interface PaginatedDeliveryPointsDTO {
  data: WeeklyList[];
  page: number;
  limit: number;
  totalCount: number;
}
