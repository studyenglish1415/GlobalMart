import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Coupon } from './coupon.entity';
import { User } from './user.entity';
import { Order } from './order.entity';

@Entity('coupon_usage')
export class CouponUsage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', nullable: false })
  coupon_id: number;

  @Column({ type: 'integer', nullable: false })
  user_id: number;

  @Column({ type: 'integer', nullable: true })
  order_id: number;

  @ManyToOne(() => Coupon, (coupon) => coupon.coupon_usages)
  @JoinColumn({ name: 'coupon_id' })
  coupon: Coupon;

  @ManyToOne(() => User, (user) => user.coupon_usages)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Order, (order) => order.coupon_usages, { nullable: true })
  @JoinColumn({ name: 'order_id' })
  order: Order;
}
