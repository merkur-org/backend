import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import Order from '@modules/orders/infra/typeorm/entities/Order';
import List from '@modules/lists/infra/typeorm/entities/List';

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  cpf: string;

  @Column()
  cnpj: string;

  @Column()
  role: 'r' | 'b' | 'p' | 'd' | 'a' | 'f' | 'bp' | 'db' | 'bf' | 'himself';

  @OneToMany(() => Order, order => order.user_id)
  orders: Order[];

  @OneToMany(() => List, list => list.user_id)
  lists: List[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default User;
