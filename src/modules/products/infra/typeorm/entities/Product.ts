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
import WeeklyOffersDetail from '@modules/weekly-offers/infra/typeorm/entities/WeeklyOffersDetail';

export type IUnit = 'kg' | 'g' | 'l' | 'ml' | 'un' | 'ton';

@Entity('products')
class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('products_name_search')
  @Column()
  name: string;

  @OneToMany(
    () => WeeklyOffersDetail,
    weeklyOffersDetail => weeklyOffersDetail.product,
  )
  details: WeeklyOffersDetail[];

  @Column()
  image: string;

  @Column('text')
  nutritional_information: string;

  @Column('text')
  observation: string;

  @Column('enum')
  unit: IUnit;

  @Column('float')
  cost_price: number;

  @Column('float')
  sale_price: number;

  @Column('float')
  wholesale_price: number;

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
