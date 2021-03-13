import { v4 as uuid } from 'uuid';

import WeeklyListDetail from '@modules/weekly-list/infra/typeorm/entities/WeeklyListDetail';
import ICreateWeeklyListDetailDTO from '@modules/weekly-list/dtos/ICreateWeeklyListDetailDTO';
import IWeeklyListDetailReposiroty from '../IWeeklyListDetailsRepository';

class FakeWeeklyListDetailRepository implements IWeeklyListDetailReposiroty {
  private weeklyListDetails: WeeklyListDetail[] = [];

  public async findById(id: string): Promise<WeeklyListDetail | undefined> {
    const foundDetail = this.weeklyListDetails.find(
      listDetail => listDetail.id === id,
    );

    return foundDetail;
  }

  public async findByListId(
    list_id: string,
  ): Promise<WeeklyListDetail[] | undefined> {
    const foundDetail = this.weeklyListDetails.filter(
      listDetail => listDetail.list_id === list_id,
    );

    return foundDetail;
  }

  public async create(
    data: ICreateWeeklyListDetailDTO[],
  ): Promise<WeeklyListDetail[]> {
    const weeklyListDetails = data.map(listDetail => {
      const detail = new WeeklyListDetail();
      Object.assign(detail, { id: uuid() }, listDetail);

      this.weeklyListDetails.push(detail);
      return detail;
    });

    return weeklyListDetails;
  }

  public async delete(id: string): Promise<void> {
    this.weeklyListDetails.filter(detail => detail.id !== id);
  }

  public async save(
    weeklyListDetails: WeeklyListDetail[],
  ): Promise<WeeklyListDetail[]> {
    const savedList = weeklyListDetails.map(listDetail => {
      const findIndex = this.weeklyListDetails.findIndex(
        foundDetail => foundDetail.id === listDetail.id,
      );

      this.weeklyListDetails[findIndex] = listDetail;

      return listDetail;
    });

    return savedList;
  }
}

export default FakeWeeklyListDetailRepository;
