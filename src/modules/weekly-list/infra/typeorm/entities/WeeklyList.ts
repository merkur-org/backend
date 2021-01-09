import User from '@modules/users/infra/typeorm/entities/User';
import {
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import WeeklyListDetail from './WeeklyListDetail';

export type IStatusList = 'unavailable' | 'available' | 'created';

@Entity('weekly_list')
class WeeklyList {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(
    () => WeeklyListDetail,
    weeklyListDetail => weeklyListDetail.list_id,
  )
  weely_list_details: WeeklyListDetail[];

  @Column('timestamp with time zone')
  start_date: Date;

  @Column('enum')
  status: IStatusList;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default WeeklyList;
