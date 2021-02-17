import { uuid } from 'uuidv4';

import IWeeklyOffersReposiroty from '@modules/weekly-offers/repositories/IWeeklyOffersRepository';
import ICreateWeeklyOffersDTO from '@modules/weekly-offers/dtos/ICreateWeeklyOffersDTO';
import IFindAllOffersInPeriod from '@modules/weekly-offers/dtos/IFindAllOffersInPeriod';

import PaginatedWeeklyOffersDTO from '@modules/weekly-offers/dtos/PaginatedWeeklyOffersDTO';
import IPaginationDTO from '@shared/dtos/IPaginationDTO';
import WeeklyOffers from '../../infra/typeorm/entities/WeeklyOffers';

class FakeWeeklyOffersRepository implements IWeeklyOffersReposiroty {
  private weeklyOffers: WeeklyOffers[] = [];

  public async findById(id: string): Promise<WeeklyOffers | undefined> {
    const foundOffers = this.weeklyOffers.find(offer => offer.id === id);

    return foundOffers;
  }

  public async findByUserId(
    user_id: string,
  ): Promise<WeeklyOffers[] | undefined> {
    const foundOffers = this.weeklyOffers.filter(
      offer => offer.user_id === user_id,
    );

    return foundOffers;
  }

  public async findByPeriod({
    start_date,
    end_date = new Date(),
  }: IFindAllOffersInPeriod): Promise<WeeklyOffers[] | undefined> {
    const foundOffers = this.weeklyOffers.filter(
      offer =>
        offer.start_date.getTime() >= start_date.getTime() &&
        offer.start_date.getTime() <= end_date.getTime(),
    );

    return foundOffers;
  }

  public async create({
    user_id,
    start_date,
  }: ICreateWeeklyOffersDTO): Promise<WeeklyOffers> {
    const offer = new WeeklyOffers();

    Object.assign(offer, { id: uuid() }, { user_id, start_date });

    this.weeklyOffers.push(offer);

    return offer;
  }

  public async delete(id: string): Promise<void> {
    this.weeklyOffers.filter(offer => offer.id !== id);
  }

  public async save(weeklyOffers: WeeklyOffers): Promise<WeeklyOffers> {
    const findIndex = this.weeklyOffers.findIndex(
      foundOffers => foundOffers.id === weeklyOffers.id,
    );

    this.weeklyOffers[findIndex] = weeklyOffers;

    return weeklyOffers;
  }

  public async findAllPaginated(
    user_id: string,
    { page, limit }: IPaginationDTO,
  ): Promise<PaginatedWeeklyOffersDTO> {
    const skippedItems = (page - 1) * limit;

    const totalCount = this.weeklyOffers.length;
    const offers: WeeklyOffers[] = [];

    let i = skippedItems;

    const limitLoop =
      skippedItems + limit < totalCount ? skippedItems + limit : totalCount - 1;

    if (i === 0 && limitLoop === 0 && this.weeklyOffers[0]) {
      offers.push(this.weeklyOffers[0]);
    }
    // eslint-disable-next-line no-plusplus
    for (i; i < limitLoop; i++) {
      offers.push(this.weeklyOffers[i]);
    }

    return {
      totalCount,
      page,
      limit,
      data: offers,
    };
  }
}

export default FakeWeeklyOffersRepository;
