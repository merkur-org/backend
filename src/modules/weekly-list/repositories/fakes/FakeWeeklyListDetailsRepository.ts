import { uuid } from 'uuidv4';

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

  public async create(
    data: ICreateWeeklyListDetailDTO,
  ): Promise<WeeklyListDetail> {
    const detail = new WeeklyListDetail();

    Object.assign(detail, { id: uuid() }, data);

    this.weeklyListDetails.push(detail);

    return detail;
  }

  public async delete(id: string): Promise<void> {
    this.weeklyListDetails.filter(detail => detail.id !== id);
  }

  public async save(
    weeklyListDetails: WeeklyListDetail,
  ): Promise<WeeklyListDetail> {
    const findIndex = this.weeklyListDetails.findIndex(
      foundDetail => foundDetail.id === weeklyListDetails.id,
    );

    this.weeklyListDetails[findIndex] = weeklyListDetails;

    return weeklyListDetails;
  }
}

export default FakeWeeklyListDetailRepository;
