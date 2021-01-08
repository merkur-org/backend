import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import Product from '@modules/products/infra/typeorm/entities/Product';
import WeeklyList from './WeeklyList';

@Entity('weekly_list_details')
class WeeklyListDetail {
  @PrimaryColumn('uuid')
  id: string;

  @OneToMany(() => WeeklyList, weeklyList => weeklyList.id)
  @JoinColumn({ name: 'list_id' })
  weekly_list: WeeklyList;

  @ManyToOne(() => Product, product => product.id)
  @JoinColumn({ name: 'product_id' })
  products: Product[];

  @Column()
  total_price: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default WeeklyListDetail;
