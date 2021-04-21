import { getRepository, Repository } from 'typeorm';

import ListOffersDetail from '@modules/lists/infra/typeorm/entities/ListOffersDetail';
import ICreateListOffersDetailDTO from '@modules/lists/dtos/ICreateListOffersDetailDTO';
import IListOffersDetailsRepository from '@modules/lists/repositories/IListOffersDetailsRepository';

class ListOffersDetailsRepository implements IListOffersDetailsRepository {
  private ormReposiroty: Repository<ListOffersDetail>;

  constructor() {
    this.ormReposiroty = getRepository(ListOffersDetail);
  }

  public async findById(id: string): Promise<ListOffersDetail | undefined> {
    const foundDetail = await this.ormReposiroty.findOne(id);

    return foundDetail;
  }

  public async findByListId(list_id: string): Promise<ListOffersDetail[]> {
    const foundDetail = await this.ormReposiroty.find({ where: { list_id } });

    return foundDetail;
  }

  public async create(
    data: ICreateListOffersDetailDTO[],
  ): Promise<ListOffersDetail[]> {
    const details = this.ormReposiroty.create(data.map(d => d));
    await this.ormReposiroty.save(details);

    return details;
  }

  public async delete(id: string): Promise<void> {
    this.ormReposiroty.delete({ id });
  }

  public async save(
    listOffersDetails: ListOffersDetail[],
  ): Promise<ListOffersDetail[]> {
    await this.ormReposiroty.save(listOffersDetails);

    return listOffersDetails;
  }
}

export default ListOffersDetailsRepository;
