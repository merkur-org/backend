import WeeklyOffersDetail from '../infra/typeorm/entities/WeeklyOffersDetail';
import ICreateWeeklyOffersDetailDTO from '../dtos/ICreateWeeklyOffersDetailDTO';

export default interface IWeeklyOffersDetailReposiroty {
  findById(id: string): Promise<WeeklyOffersDetail | undefined>;
  findByListsId(offer_id: string): Promise<WeeklyOffersDetail[] | undefined>;
  create(data: ICreateWeeklyOffersDetailDTO[]): Promise<WeeklyOffersDetail[]>;
  delete(id: string): Promise<void>;
  save(weeklyOffersDetail: WeeklyOffersDetail[]): Promise<WeeklyOffersDetail[]>;
}
