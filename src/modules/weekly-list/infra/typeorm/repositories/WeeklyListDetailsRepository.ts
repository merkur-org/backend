import { getRepository, Repository } from 'typeorm';

import IWeeklyListDetailsReposiroty from '@modules/weekly-list/repositories/IWeeklyListDetailsRepository';
import ICreateWeeklyListDetailDTO from '@modules/weekly-list/dtos/ICreateWeeklyListDetailDTO';
import WeeklyListDetails from '../entities/WeeklyListDetail';

class WeeklyListDetailsRepository implements IWeeklyListDetailsReposiroty {
  private ormRepository: Repository<WeeklyListDetails>;

  constructor() {
    this.ormRepository = getRepository(WeeklyListDetails);
  }

  public async findById(id: string): Promise<WeeklyListDetails | undefined> {
    const foundDetail = this.ormRepository.findOne(id);

    return foundDetail;
  }

  public async create(
    data: ICreateWeeklyListDetailDTO,
  ): Promise<WeeklyListDetails> {
    const detail = this.ormRepository.create(data);

    await this.ormRepository.save(detail);

    return detail;
  }

  public async delete(id: string): Promise<void> {
    this.ormRepository.delete({ id });
  }

  public async save(
    weeklyListDetail: WeeklyListDetails,
  ): Promise<WeeklyListDetails> {
    return this.ormRepository.save(weeklyListDetail);
  }
}

export default WeeklyListDetailsRepository;
