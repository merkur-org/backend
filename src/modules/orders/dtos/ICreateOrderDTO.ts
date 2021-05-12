import {
  IPaymentStatus,
  IPaymentType,
  ISalesType,
} from '../infra/typeorm/entities/Order';

export default interface ICreateOrderDTO {
  date: Date;
  value: number;
  final_value: number;
  payment_type: IPaymentType;
  payment_status: IPaymentStatus;
  sales_type: ISalesType;
  delivery_point_id: string;
  user_id: string;
  list_id: string;
}
