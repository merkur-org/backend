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

import WeeklyOffersDetail from './WeeklyOffersDetail';

export type IStatusOffers = 'unavailable' | 'available' | 'created';

@Entity('weekly_offers')
class WeeklyOffers {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(
    () => WeeklyOffersDetail,
    weeklyOffersDetail => weeklyOffersDetail.weekly_offer,
  )
  details: WeeklyOffersDetail[];

  @Column('enum')
  status: IStatusOffers;

  @Column('timestamp with time zone')
  start_date: Date;

  @Column('timestamp with time zone')
  end_date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default WeeklyOffers;
