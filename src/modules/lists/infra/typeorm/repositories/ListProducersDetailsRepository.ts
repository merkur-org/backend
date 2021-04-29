import { getRepository, Repository } from 'typeorm';

import ListProducersDetail from '@modules/lists/infra/typeorm/entities/ListProducersDetail';
import ICreateListProducersDetailDTO from '@modules/lists/dtos/ICreateListProducersDetailDTO';
import IListProducersDetailsRepository from '@modules/lists/repositories/IListProducersDetailsRepository';

class ListProducersDetailsRepository
  implements IListProducersDetailsRepository {
  private ormRepository: Repository<ListProducersDetail>;

  constructor() {
    this.ormRepository = getRepository(ListProducersDetail);
  }

  public async findById(id: string): Promise<ListProducersDetail | undefined> {
    const foundDetail = await this.ormRepository.findOne(id);

    return foundDetail;
  }

  public async findByListId(list_id: string): Promise<ListProducersDetail[]> {
    const foundDetail = await this.ormRepository.find({ where: { list_id } });

    return foundDetail;
  }

  public async create(
    data: ICreateListProducersDetailDTO[],
  ): Promise<ListProducersDetail[]> {
    const details = this.ormRepository.create(data.map(d => d));
    await this.ormRepository.save(details);

    return details;
  }

  public async delete(id: string): Promise<void> {
    this.ormRepository.delete({ id });
  }

  public async save(
    listProducersDetails: ListProducersDetail[],
  ): Promise<ListProducersDetail[]> {
    await this.ormRepository.save(listProducersDetails);

    return listProducersDetails;
  }
}

export default ListProducersDetailsRepository;
