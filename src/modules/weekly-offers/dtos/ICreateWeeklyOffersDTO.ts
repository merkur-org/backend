export type IStatusOffers = 'unavailable' | 'available' | 'created';

export default interface ICreateWeeklyOffersDTO {
  user_id: string;
  status: IStatusOffers;
  start_date: Date;
  end_date: Date;
}
