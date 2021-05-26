import User from '../infra/typeorm/entities/User';

export default interface IPaginatedUsersDTO {
  data: User[];
  page: number;
  limit: number;
  total_count: number;
}
