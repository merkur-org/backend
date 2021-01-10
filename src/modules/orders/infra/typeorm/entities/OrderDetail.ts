import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import Product from '@modules/products/infra/typeorm/entities/Product';
import Order from './Order';

@Entity('order_details')
class OrderDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  order_id: string;

  @ManyToOne(() => Order, orderDetail => orderDetail.id)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column()
  product_id: string;

  @ManyToOne(() => Product, product => product.id)
  @JoinColumn({ name: 'product_id' })
  products: Product;

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
