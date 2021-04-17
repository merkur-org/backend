export type IStatusList = 'unavailable' | 'available' | 'created';

export default interface ICreateWeeklyListDTO {
  user_id: string;
  start_date: Date;
  end_date: Date;
  status: IStatusList;
}
