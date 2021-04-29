import { getRepository, Repository } from 'typeorm';

import ListOffersDetail from '@modules/lists/infra/typeorm/entities/ListOffersDetail';
import ICreateListOffersDetailDTO from '@modules/lists/dtos/ICreateListOffersDetailDTO';
import IListOffersDetailsRepository from '@modules/lists/repositories/IListOffersDetailsRepository';

class ListOffersDetailsRepository implements IListOffersDetailsRepository {
  private ormRepository: Repository<ListOffersDetail>;

  constructor() {
    this.ormRepository = getRepository(ListOffersDetail);
  }

  public async findById(id: string): Promise<ListOffersDetail | undefined> {
    const foundDetail = await this.ormRepository.findOne(id);

    return foundDetail;
  }

  public async findByListId(list_id: string): Promise<ListOffersDetail[]> {
    const foundDetail = await this.ormRepository.find({ where: { list_id } });

    return foundDetail;
  }

  public async create(
    data: ICreateListOffersDetailDTO[],
  ): Promise<ListOffersDetail[]> {
    const details = this.ormRepository.create(data.map(d => d));
    await this.ormRepository.save(details);

    return details;
  }

  public async delete(id: string): Promise<void> {
    this.ormRepository.delete({ id });
  }

  public async save(
    listOffersDetails: ListOffersDetail[],
  ): Promise<ListOffersDetail[]> {
    await this.ormRepository.save(listOffersDetails);

    return listOffersDetails;
  }
}

export default ListOffersDetailsRepository;
