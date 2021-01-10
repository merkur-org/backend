import { getRepository, Repository } from 'typeorm';

import WeeklyListDetail from '@modules/weekly-list/infra/typeorm/entities/WeeklyListDetail';
import ICreateWeeklyListDetailDTO from '@modules/weekly-list/dtos/ICreateWeeklyListDetailDTO';
import IWeeklyListDetailReposiroty from '@modules/weekly-list/repositories/IWeeklyListDetailsRepository';

class WeeklyListDetailRepository implements IWeeklyListDetailReposiroty {
  private ormReposiroty: Repository<WeeklyListDetail>;

  constructor() {
    this.ormReposiroty = getRepository(WeeklyListDetail);
  }

  public async findById(id: string): Promise<WeeklyListDetail | undefined> {
    const foundDetail = await this.ormReposiroty.findOne(id);

    return foundDetail;
  }

  public async findByListId(
    list_id: string,
  ): Promise<WeeklyListDetail[] | undefined> {
    const foundDetail = await this.ormReposiroty.find({ where: { list_id } });

    return foundDetail;
  }

  public async create(
    data: ICreateWeeklyListDetailDTO[],
  ): Promise<WeeklyListDetail[]> {
    const details = this.ormReposiroty.create(data.map(d => d));
    await this.ormReposiroty.save(details);

    return details;
  }

  public async delete(id: string): Promise<void> {
    this.ormReposiroty.delete({ id });
  }

  public async save(
    weeklyListDetails: WeeklyListDetail[],
  ): Promise<WeeklyListDetail[]> {
    await this.ormReposiroty.save(weeklyListDetails);

    return weeklyListDetails;
  }
}

export default WeeklyListDetailRepository;
