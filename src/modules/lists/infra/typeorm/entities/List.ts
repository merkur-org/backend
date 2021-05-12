import { IStatus } from '@modules/lists/dtos/ICreateListDTO';
import User from '@modules/users/infra/typeorm/entities/User';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import Order from '@modules/orders/infra/typeorm/entities/Order';
import ListProducersDetail from './ListProducersDetail';
import ListOffersDetail from './ListOffersDetail';

export type TList = 'offer' | 'producer';
@Entity('lists')
class List {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(
    () => ListProducersDetail,
    listProducersDetail => listProducersDetail.list,
  )
  details_producers: ListProducersDetail[];

  @OneToMany(
    () => ListOffersDetail,
    listOffersDetail => listOffersDetail.list_id,
  )
  details_offer: ListOffersDetail[];

  @OneToMany(() => Order, order => order.list_id)
  orders: Order[];

  @Column('enum')
  status: IStatus;

  @Column('timestamp with time zone')
  start_date: Date;

  @Column('timestamp with time zone')
  end_date: Date;

  @Column('enum')
  type: TList;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default List;
