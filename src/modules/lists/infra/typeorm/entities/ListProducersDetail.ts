import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import Product from '@modules/products/infra/typeorm/entities/Product';
import List from './List';

@Entity('list_producers_details')
class ListProducersDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  list_id: string;

  @ManyToOne(() => List, list => list.details_list_producers, {
    cascade: true,
  })
  @JoinColumn({ name: 'list_id' })
  list: List;

  @Column('uuid')
  product_id: string;

  @ManyToOne(() => Product, product => product.producers_details, {
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column('timestamp with time zone')
  due_date: Date;

  @Column()
  lot: string;

  @Column('int')
  quantity: number;

  @Column('float')
  unit_price: number;

  @Column('float')
  discount: number;

  @Column()
  total_price: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default ListProducersDetail;
