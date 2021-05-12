import DeliveryPoint from '@modules/delivery-points/infra/typeorm/entities/DeliveryPoints';
import List from '@modules/lists/infra/typeorm/entities/List';
import User from '@modules/users/infra/typeorm/entities/User';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import OrderDetail from './OrderDetail';

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
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('timestamp with time zone')
  date: Date;

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

  @Column()
  list_id: string;

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => List, list => list.id)
  @JoinColumn({ name: 'list_id' })
  list: List;

  @OneToMany(() => OrderDetail, orderDetail => orderDetail.order_id)
  order_details: OrderDetail[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Order;
