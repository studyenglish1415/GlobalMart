import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
  CreateDateColumn,
} from 'typeorm';
import { Cart } from './cart.entity';
import { Order } from './order.entity';
import { Review } from './review.entity';
import { Address } from './address.entity';
import { CouponUsage } from './coupon-usage.entity';
import { UserSession } from './user-session.entity';

@Entity('users')
@Index(['email'], { unique: true })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'text' })
  password_hash: string;

  @Column({ type: 'text', nullable: true })
  first_name: string;

  @Column({ type: 'text', nullable: true })
  last_name: string;

  @Column({ type: 'date', nullable: true })
  birth_date: Date;

  @Column({ type: 'text', nullable: true })
  phone: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @Column({ type: 'boolean', default: false })
  is_admin: boolean;

  @Column({ type: 'text', nullable: true })
  status: string;

  @OneToMany(() => Address, (address) => address.user, { onDelete: 'CASCADE' })
  addresses: Address[];

  @OneToMany(() => Cart, (cart) => cart.user, { onDelete: 'CASCADE' })
  carts: Cart[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Review, (review) => review.user, { onDelete: 'CASCADE' })
  reviews: Review[];

  @OneToMany(() => CouponUsage, (couponUsage) => couponUsage.user)
  coupon_usages: CouponUsage[];

  @OneToMany(() => UserSession, (session) => session.user, {
    onDelete: 'CASCADE',
  })
  sessions: UserSession[];
}
