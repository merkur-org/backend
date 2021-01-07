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

  @Column()
  list_id: string;

  @ManyToOne(() => WeeklyList)
  @JoinColumn({ name: 'list_id' })
  weekly_list: WeeklyList;

  @Column()
  product_id: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column()
  quantity: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default WeeklyListDetail;
