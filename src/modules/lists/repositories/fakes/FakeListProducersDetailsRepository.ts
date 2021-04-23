import { uuid } from 'uuidv4';

import ListProducersDetail from '@modules/lists/infra/typeorm/entities/ListProducersDetail';
import ICreateListProducersDetailDTO from '@modules/lists/dtos/ICreateListProducersDetailDTO';
import IListProducersDetailsRepository from '../IListProducersDetailsRepository';

class FakeListProducersDetailsRepository
  implements IListProducersDetailsRepository {
  private listProducersDetails: ListProducersDetail[] = [];

  public async findById(id: string): Promise<ListProducersDetail | undefined> {
    const foundDetail = this.listProducersDetails.find(
      listDetail => listDetail.id === id,
    );

    return foundDetail;
  }

  public async findByListId(list_id: string): Promise<ListProducersDetail[]> {
    const foundDetail = this.listProducersDetails.filter(
      listDetail => listDetail.list_id === list_id,
    );

    return foundDetail;
  }

  public async create(
    data: ICreateListProducersDetailDTO[],
  ): Promise<ListProducersDetail[]> {
    const listyofferDetails = data.map(listDetail => {
      const detail = new ListProducersDetail();
      Object.assign(detail, { id: uuid() }, listDetail);

      this.listProducersDetails.push(detail);
      return detail;
    });

    return listyofferDetails;
  }

  public async delete(id: string): Promise<void> {
    this.listProducersDetails = this.listProducersDetails.filter(
      detail => detail.id !== id,
    );
  }

  public async save(
    ListProducersDetails: ListProducersDetail[],
  ): Promise<ListProducersDetail[]> {
    const savedOffers = ListProducersDetails.map(listDetail => {
      const findIndex = this.listProducersDetails.findIndex(
        foundDetail => foundDetail.id === listDetail.id,
      );

      this.listProducersDetails[findIndex] = listDetail;

      return listDetail;
    });

    return savedOffers;
  }
}

export default FakeListProducersDetailsRepository;
