import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import Product from '@modules/products/infra/typeorm/entities/Product';
import WeeklyList from './WeeklyList';

@Entity('weekly_list_details')
class WeeklyListDetail {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  list_id: string;

  @ManyToOne(() => WeeklyList, weeklyList => weeklyList.id)
  @JoinColumn({ name: 'list_id' })
  weekly_list: WeeklyList;

  @Column('uuid')
  product_id: string;

  @ManyToOne(() => Product, product => product.id)
  @JoinColumn({ name: 'product_id' })
  products: Product[];

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

export default WeeklyListDetail;
