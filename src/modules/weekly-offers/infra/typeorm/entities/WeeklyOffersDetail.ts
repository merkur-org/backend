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
import WeeklyOffers from './WeeklyOffers';

@Entity('weekly_offer_details')
class WeeklyOffersDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  offer_id: string;

  @ManyToOne(() => WeeklyOffers, weeklyOffers => weeklyOffers.details, {
    cascade: true,
  })
  @JoinColumn({ name: 'offer_id' })
  weekly_offer: WeeklyOffers;

  @Column('uuid')
  product_id: string;

  @ManyToOne(() => Product, product => product.details, {
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column('float')
  quantity: number;

  @Column('float')
  unit_price: number;

  @Column('float')
  sale_price: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default WeeklyOffersDetail;
