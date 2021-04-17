import { getRepository, Repository } from 'typeorm';
import IWeeklyOffersRepository from '@modules/weekly-offers/repositories/IWeeklyOffersRepository';
import ICreateWeeklyOffersDTO from '@modules/weekly-offers/dtos/ICreateWeeklyOffersDTO';
import IFindAllOffersInPeriod from '@modules/weekly-offers/dtos/IFindAllOffersInPeriod';
import WeeklyOffers from '@modules/weekly-offers/infra/typeorm/entities/WeeklyOffers';
import IPaginationDTO from '@shared/dtos/IPaginationDTO';
import PaginatedWeeklyOffersDTO from '@modules/weekly-offers/dtos/PaginatedWeeklyOffersDTO';
import { AfterDate, BeforeDate } from '@shared/utils/typeorm';
// import WeeklyOffersDetail from '../entities/WeeklyOffersDetail';

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
      where: {
        start_date: BeforeDate(start_date),
        end_date: AfterDate(end_date),
      },
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
    { page, limit }: IPaginationDTO,
    user_id?: string,
  ): Promise<PaginatedWeeklyOffersDTO> {
    const skipped_items = (page - 1) * limit;

    // const [offers, total_count] = await this.ormRepository
    //   .createQueryBuilder('wo')
    //   .select('wo.*')
    //   .addSelect('json_agg(wod) as "details"')
    //   .orderBy('wo.created_at', 'DESC')
    //   .leftJoin(WeeklyOffersDetail, 'wod', 'wo.id = wod.offer_id')
    //   .where(user_id ? `wo.user_id = ${user_id}` : '')
    //   .groupBy('wo.id')
    //   .offset(skipped_items)
    //   .limit(limit)
    //   .getManyAndCount();
    const [offers, total_count] = await this.ormRepository.findAndCount({
      where: user_id ? { user_id } : '',
      relations: ['details'],
      skip: skipped_items,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return {
      total_count,
      page,
      limit,
      data: offers,
    };
  }

  public async findBetweenStartAndEndDate(
    { page, limit }: IPaginationDTO,
    date = new Date(),
  ): Promise<PaginatedWeeklyOffersDTO> {
    const skipped_items = (page - 1) * limit;

    const [offers, total_count] = await this.ormRepository.findAndCount({
      where: {
        start_date: BeforeDate(date),
        end_date: AfterDate(date),
      },
      relations: ['details'],
      skip: skipped_items,
      take: limit,
    });

    return {
      total_count,
      page,
      limit,
      data: offers,
    };
  }
}

export default WeeklyOffersRepository;
