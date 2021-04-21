import ListProducersDetail from '../infra/typeorm/entities/ListProducersDetail';
import ICreateListProducersDetailDTO from '../dtos/ICreateListProducersDetailDTO';

export default interface IListProducersDetailsRepository {
  findById(id: string): Promise<ListProducersDetail | undefined>;
  findByListId(list_id: string): Promise<ListProducersDetail[]>;
  create(data: ICreateListProducersDetailDTO[]): Promise<ListProducersDetail[]>;
  delete(id: string): Promise<void>;
  save(
    listProducersDetail: ListProducersDetail[],
  ): Promise<ListProducersDetail[]>;
}
