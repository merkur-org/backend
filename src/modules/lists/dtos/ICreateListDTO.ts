export type IStatus = 'unavailable' | 'available' | 'created';

export default interface ICreateListDTO {
  user_id: string;
  producer_id: string;
  status: IStatus;
  type: 'offer' | 'producer';
  start_date: Date;
  end_date: Date;
}
