import WeeklyList from '../infra/typeorm/entities/WeeklyList';

export default interface IPaginatedListsDTO {
  data: WeeklyList[];
  page: number;
  limit: number;
  total_count: number;
}
