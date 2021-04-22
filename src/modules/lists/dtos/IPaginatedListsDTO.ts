import List from '../infra/typeorm/entities/List';

export default interface IPaginatedListsDTO {
  data: List[];
  page: number;
  limit: number;
  total_count: number;
}
