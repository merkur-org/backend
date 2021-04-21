import { v4 as uuid } from 'uuid';

import ListOffersDetail from '@modules/lists/infra/typeorm/entities/ListOffersDetail';
import ICreateListOffersDetailDTO from '@modules/lists/dtos/ICreateListOffersDetailDTO';
import IListOffersDetailsRepository from '../IListOffersDetailsRepository';

class FakeListOffersDetailsRepository implements IListOffersDetailsRepository {
  private listOffersDetails: ListOffersDetail[] = [];

  public async findById(id: string): Promise<ListOffersDetail | undefined> {
    const foundDetail = this.listOffersDetails.find(
      listDetail => listDetail.id === id,
    );

    return foundDetail;
  }

  public async findByListId(list_id: string): Promise<ListOffersDetail[]> {
    const foundDetail = this.listOffersDetails.filter(
      listDetail => listDetail.list_id === list_id,
    );

    return foundDetail;
  }

  public async create(
    data: ICreateListOffersDetailDTO[],
  ): Promise<ListOffersDetail[]> {
    const ListOffersDetails = data.map(listDetail => {
      const detail = new ListOffersDetail();
      Object.assign(detail, { id: uuid() }, listDetail);

      this.listOffersDetails.push(detail);
      return detail;
    });

    return ListOffersDetails;
  }

  public async delete(id: string): Promise<void> {
    this.listOffersDetails.filter(detail => detail.id !== id);
  }

  public async save(
    ListOffersDetails: ListOffersDetail[],
  ): Promise<ListOffersDetail[]> {
    const savedList = ListOffersDetails.map(listDetail => {
      const findIndex = this.listOffersDetails.findIndex(
        foundDetail => foundDetail.id === listDetail.id,
      );

      this.listOffersDetails[findIndex] = listDetail;

      return listDetail;
    });

    return savedList;
  }
}

export default FakeListOffersDetailsRepository;
