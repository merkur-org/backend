import { getRepository, Repository } from 'typeorm';

import ListProducersDetail from '@modules/lists/infra/typeorm/entities/ListProducersDetail';
import ICreateListProducersDetailDTO from '@modules/lists/dtos/ICreateListProducersDetailDTO';
import IListProducersDetailsRepository from '@modules/lists/repositories/IListProducersDetailsRepository';

class ListProducersDetailsRepository
  implements IListProducersDetailsRepository {
  private ormReposiroty: Repository<ListProducersDetail>;

  constructor() {
    this.ormReposiroty = getRepository(ListProducersDetail);
  }

  public async findById(id: string): Promise<ListProducersDetail | undefined> {
    const foundDetail = await this.ormReposiroty.findOne(id);

    return foundDetail;
  }

  public async findByListId(list_id: string): Promise<ListProducersDetail[]> {
    const foundDetail = await this.ormReposiroty.find({ where: { list_id } });

    return foundDetail;
  }

  public async create(
    data: ICreateListProducersDetailDTO[],
  ): Promise<ListProducersDetail[]> {
    const details = this.ormReposiroty.create(data.map(d => d));
    await this.ormReposiroty.save(details);

    return details;
  }

  public async delete(id: string): Promise<void> {
    this.ormReposiroty.delete({ id });
  }

  public async save(
    listProducersDetails: ListProducersDetail[],
  ): Promise<ListProducersDetail[]> {
    await this.ormReposiroty.save(listProducersDetails);

    return listProducersDetails;
  }
}

export default ListProducersDetailsRepository;
