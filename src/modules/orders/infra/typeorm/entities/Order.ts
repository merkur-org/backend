import DeliveryPoint from '@modules/delivery-points/infra/typeorm/entities/DeliveryPoints';
import User from '@modules/users/infra/typeorm/entities/User';
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export type IPaymentStatus =
  | 'processing'
  | 'awaiting_payment'
  | 'canceled'
  | 'expired'
  | 'paid';

export type IPaymentType =
  | 'credit_card'
  | 'money'
  | 'pix'
  | 'bank_slip'
  | 'bank_transfer';

export type ISalesType = 'wholesale' | 'retail';

@Entity('orders')
class Order {
  @PrimaryColumn('uuid')
  id: string;

  @Column('timestamp with time zone')
  date: number;

  @Column('float')
  value: number;

  @Column('float')
  final_value: number;

  @Column('enum')
  payment_type: IPaymentType;

  @Column('enum')
  payment_status: IPaymentStatus;

  @Column('enum')
  sales_type: ISalesType;

  @Column()
  delivery_point_id: string;

  @ManyToOne(() => DeliveryPoint)
  @JoinColumn({ name: 'delivery_point_id' })
  delivery_point: DeliveryPoint;

  @Column()
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Order;
