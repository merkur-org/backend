import { uuid } from 'uuidv4';

import WeeklyOffersDetail from '@modules/weekly-offers/infra/typeorm/entities/WeeklyOffersDetail';
import ICreateWeeklyOffersDetailDTO from '@modules/weekly-offers/dtos/ICreateWeeklyOffersDetailDTO';
import IWeeklyOffersDetailReposiroty from '../IWeeklyOffersDetailsRepository';

class FakeWeeklyOffersDetailRepository
  implements IWeeklyOffersDetailReposiroty {
  private weeklyOffersDetails: WeeklyOffersDetail[] = [];

  public async findById(id: string): Promise<WeeklyOffersDetail | undefined> {
    const foundDetail = this.weeklyOffersDetails.find(
      offerDetail => offerDetail.id === id,
    );

    return foundDetail;
  }

  public async findByListsId(
    offer_id: string,
  ): Promise<WeeklyOffersDetail[] | undefined> {
    const foundDetail = this.weeklyOffersDetails.filter(
      offerDetail => offerDetail.offer_id === offer_id,
    );

    return foundDetail;
  }

  public async create(
    data: ICreateWeeklyOffersDetailDTO[],
  ): Promise<WeeklyOffersDetail[]> {
    const weeklyofferDetails = data.map(offerDetail => {
      const detail = new WeeklyOffersDetail();
      Object.assign(detail, { id: uuid() }, offerDetail);

      this.weeklyOffersDetails.push(detail);
      return detail;
    });

    return weeklyofferDetails;
  }

  public async delete(id: string): Promise<void> {
    this.weeklyOffersDetails.filter(detail => detail.id !== id);
  }

  public async save(
    weeklyOffersDetails: WeeklyOffersDetail[],
  ): Promise<WeeklyOffersDetail[]> {
    const savedOffers = weeklyOffersDetails.map(offerDetail => {
      const findIndex = this.weeklyOffersDetails.findIndex(
        foundDetail => foundDetail.id === offerDetail.id,
      );

      this.weeklyOffersDetails[findIndex] = offerDetail;

      return offerDetail;
    });

    return savedOffers;
  }
}

export default FakeWeeklyOffersDetailRepository;
