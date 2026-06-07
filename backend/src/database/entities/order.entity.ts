import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { OrderItem } from './order-item.entity';
import { Payment } from './payment.entity';
import { OrderStatusHistory } from './order-status-history.entity';
import { CouponUsage } from './coupon-usage.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', nullable: false })
  user_id: number;

  @Column({ type: 'text', nullable: true })
  status: string;

  @Column({ type: 'text', nullable: true })
  currency: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  total_price: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => OrderItem, (item) => item.order, { onDelete: 'CASCADE' })
  order_items: OrderItem[];

  @OneToMany(() => Payment, (payment) => payment.order, {
    onDelete: 'CASCADE',
  })
  payments: Payment[];

  @OneToMany(() => OrderStatusHistory, (history) => history.order, {
    onDelete: 'CASCADE',
  })
  status_history: OrderStatusHistory[];

  @OneToMany(() => CouponUsage, (couponUsage) => couponUsage.order)
  coupon_usages: CouponUsage[];
}
