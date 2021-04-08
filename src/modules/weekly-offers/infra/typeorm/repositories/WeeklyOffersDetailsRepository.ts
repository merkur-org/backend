import { getRepository, Repository } from 'typeorm';

import WeeklyOffersDetail from '@modules/weekly-offers/infra/typeorm/entities/WeeklyOffersDetail';
import ICreateWeeklyOffersDetailDTO from '@modules/weekly-offers/dtos/ICreateWeeklyOffersDetailDTO';
import IWeeklyOffersDetailReposiroty from '@modules/weekly-offers/repositories/IWeeklyOffersDetailsRepository';

class WeeklyOffersDetailRepository implements IWeeklyOffersDetailReposiroty {
  private ormReposiroty: Repository<WeeklyOffersDetail>;

  constructor() {
    this.ormReposiroty = getRepository(WeeklyOffersDetail);
  }

  public async findById(id: string): Promise<WeeklyOffersDetail | undefined> {
    const foundDetail = await this.ormReposiroty.findOne(id);

    return foundDetail;
  }

  public async findByListsId(
    offer_id: string,
  ): Promise<WeeklyOffersDetail[] | undefined> {
    const foundDetail = await this.ormReposiroty.find({ where: { offer_id } });

    return foundDetail;
  }

  public async create(
    data: ICreateWeeklyOffersDetailDTO[],
  ): Promise<WeeklyOffersDetail[]> {
    const details = this.ormReposiroty.create(data.map(d => d));
    await this.ormReposiroty.save(details);

    return details;
  }

  public async delete(id: string): Promise<void> {
    this.ormReposiroty.delete({ id });
  }

  public async save(
    weeklyOffersDetails: WeeklyOffersDetail[],
  ): Promise<WeeklyOffersDetail[]> {
    await this.ormReposiroty.save(weeklyOffersDetails);

    return weeklyOffersDetails;
  }
}

export default WeeklyOffersDetailRepository;
