import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('delivery_points')
class DeliveryPoint {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  suburb: string;

  @Column()
  street: string;

  @Column('int')
  number: number;

  @Column()
  cep: string;

  @Column('float')
  latitude: number;

  @Column('float')
  longitude: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default DeliveryPoint;
