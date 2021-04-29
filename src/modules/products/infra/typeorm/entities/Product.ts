import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { Expose } from 'class-transformer';

import uploadConfig from '@config/upload';
import ListOffersDetail from '@modules/lists/infra/typeorm/entities/ListOffersDetail';
import ListProducersDetail from '@modules/lists/infra/typeorm/entities/ListProducersDetail';

export type IUnit = 'kg' | 'g' | 'l' | 'ml' | 'un' | 'ton' | 'box' | 'bag';

@Entity('products')
class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('products_name_search')
  @Column()
  name: string;

  @OneToMany(
    () => ListOffersDetail,
    listOffersDetail => listOffersDetail.product,
  )
  offers_details: ListOffersDetail[];

  @OneToMany(
    () => ListProducersDetail,
    listProducersDetail => listProducersDetail.product,
  )
  producers_details: ListProducersDetail[];

  @Column()
  image: string;

  @Column('text')
  nutritional_information: string;

  @Column('text')
  observation: string;

  @Column('enum')
  unit_sale: IUnit;

  @Column('enum')
  unit_buy: IUnit;

  @Column('float')
  fraction_buy: number;

  @Column('float')
  fraction_sale: number;

  @Column('float')
  cost_price: number;

  @Column('float')
  sale_price: number;

  @Column('float')
  wholesale_price: number;

  @Column('boolean')
  organic: boolean;

  @Column('boolean')
  highlights: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Expose({ name: 'image_url' })
  getImageUrl(): string | null {
    if (!this.image) {
      return null;
    }

    switch (uploadConfig.driver) {
      case 'disk':
        return `${process.env.APP_API_URL}/files/${this.image}`;
      case 's3':
        return `https://${uploadConfig.config.aws.bucket}.s3.amazonaws.com/${this.image}`;
      default:
        return null;
    }
  }
}

export default Product;
