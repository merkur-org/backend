import { getRepository, Repository, Between } from 'typeorm';

import IWeeklyOffersRepository from '@modules/weekly-offers/repositories/IWeeklyOffersRepository';
import ICreateWeeklyOffersDTO from '@modules/weekly-offers/dtos/ICreateWeeklyOffersDTO';
import IFindAllOffersInPeriod from '@modules/weekly-offers/dtos/IFindAllOffersInPeriod';
import WeeklyOffers from '@modules/weekly-offers/infra/typeorm/entities/WeeklyOffers';
import IPaginationDTO from '@shared/dtos/IPaginationDTO';
import PaginatedWeeklyOffersDTO from '@modules/weekly-offers/dtos/PaginatedWeeklyOffersDTO';
import WeeklyOffersDetail from '../entities/WeeklyOffersDetail';

class WeeklyOffersRepository implements IWeeklyOffersRepository {
  private ormRepository: Repository<WeeklyOffers>;

  constructor() {
    this.ormRepository = getRepository(WeeklyOffers);
  }

  public async findById(id: string): Promise<WeeklyOffers | undefined> {
    const foundOffers = this.ormRepository.findOne(id);

    return foundOffers;
  }

  public async findByUserId(
    user_id: string,
  ): Promise<WeeklyOffers[] | undefined> {
    const foundOfferss = this.ormRepository.find({ where: { user_id } });

    return foundOfferss;
  }

  public async findByPeriod({
    start_date,
    end_date = new Date(),
  }: IFindAllOffersInPeriod): Promise<WeeklyOffers[] | undefined> {
    const foundOfferss = this.ormRepository.find({
      where: Between(start_date, end_date),
    });

    return foundOfferss;
  }

  public async create({
    user_id,
    start_date,
    end_date,
    status,
  }: ICreateWeeklyOffersDTO): Promise<WeeklyOffers> {
    const offer = this.ormRepository.create({
      user_id,
      start_date,
      end_date,
      status,
    });
    await this.ormRepository.save(offer);

    return offer;
  }

  public async delete(id: string): Promise<void> {
    this.ormRepository.delete({ id });
  }

  public async save(weeklyOffers: WeeklyOffers): Promise<WeeklyOffers> {
    await this.ormRepository.save(weeklyOffers);

    return weeklyOffers;
  }

  public async findAllPaginated(
    user_id: string,
    { page, limit }: IPaginationDTO,
  ): Promise<PaginatedWeeklyOffersDTO> {
    const skippedItems = (page - 1) * limit;

    const totalCount = await this.ormRepository.count();
    const offers = await this.ormRepository
      .createQueryBuilder('wl')
      .select('wl.*')
      .addSelect('json_agg(wld) as "details"')
      .orderBy('wl.created_at', 'DESC')
      .leftJoin(WeeklyOffersDetail, 'wld', 'wl.id = wld.offer_id')
      .where('wl.user_id = :user_id', { user_id })
      .groupBy('wl.id')
      .offset(skippedItems)
      .limit(limit)
      .getRawMany();

    return {
      totalCount,
      page,
      limit,
      data: offers,
    };
  }
}

export default WeeklyOffersRepository;
