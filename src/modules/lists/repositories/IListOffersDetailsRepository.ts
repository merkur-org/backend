import ListOffersDetail from '../infra/typeorm/entities/ListOffersDetail';
import ICreateListOffersDetailDTO from '../dtos/ICreateListOffersDetailDTO';

export default interface IListOffersDetailsRepository {
  findById(id: string): Promise<ListOffersDetail | undefined>;
  findByListId(list_id: string): Promise<ListOffersDetail[]>;
  create(data: ICreateListOffersDetailDTO[]): Promise<ListOffersDetail[]>;
  delete(id: string): Promise<void>;
  save(listOffersDetail: ListOffersDetail[]): Promise<ListOffersDetail[]>;
}
