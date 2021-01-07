import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import Product from '@modules/products/infra/typeorm/entities/Product';
import Order from './Order';

@Entity('order_details')
class OrderDetail {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  order_id: string;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  delivery_point: Order;

  @Column()
  product_id: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  user: Product;

  @Column('float')
  unit_price: number;

  @Column('float')
  quantity: number;

  @Column('float')
  discount: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default OrderDetail;
