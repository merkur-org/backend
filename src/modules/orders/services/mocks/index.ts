import { uuid } from 'uuidv4';
import {
  IPaymentStatus,
  IPaymentType,
  ISalesType,
} from '@modules/orders/infra/typeorm/entities/Order';

export const fakeOrder = {
  date: new Date(),
  delivery_point_id: uuid(),
  final_value: 45,
  payment_status: 'processing' as IPaymentStatus,
  payment_type: 'credit_card' as IPaymentType,
  sales_type: 'wholesale' as ISalesType,
  value: 456,
  user_id: 'user-id',
  details: [
    {
      product_id: '5971f952-d12a-4493-ba85-5fd976db275c',
      unit_price: 22,
      quantity: 2,
      discount: 1,
    },
  ],
};

export const fakeOrder1 = {
  date: new Date(),
  delivery_point_id: uuid(),
  final_value: 45,
  payment_status: 'processing' as IPaymentStatus,
  payment_type: 'credit_card' as IPaymentType,
  sales_type: 'wholesale' as ISalesType,
  value: 456,
  user_id: 'user-id',
  details: [
    {
      product_id: '5971f952-d12a-4493-ba85-5fd976db275c',
      unit_price: 22,
      quantity: 2,
      discount: 1,
    },
  ],
};
