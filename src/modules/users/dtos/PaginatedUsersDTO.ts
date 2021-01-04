import User from '../infra/typeorm/entities/User';

export default interface PaginatedUsersDTO {
  data: User[];
  page: number;
  limit: number;
  totalCount: number;
}