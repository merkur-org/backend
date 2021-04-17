import WeeklyOffers from '../infra/typeorm/entities/WeeklyOffers';

export default interface PaginatedWeeklyOffersDTO {
  data: WeeklyOffers[];
  page: number;
  limit: number;
  total_count: number;
}
