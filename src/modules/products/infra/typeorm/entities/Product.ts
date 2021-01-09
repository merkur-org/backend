import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type IUnit = 'kg' | 'g' | 'l' | 'ml' | 'un' | 'ton';

@Entity('products')
class Product {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

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
}

export default Product;
