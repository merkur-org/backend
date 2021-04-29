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

@Entity('list_offers_details')
class ListOffersDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  list_id: string;

  @ManyToOne(() => List, list => list.details_offer, {
    cascade: true,
  })
  @JoinColumn({ name: 'list_id' })
  list: List;

  @Column('uuid')
  product_id: string;

  @ManyToOne(() => Product, product => product.offers_details, {
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

export default ListOffersDetail;
