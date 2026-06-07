import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  Index,
  Unique,
} from 'typeorm';
import { CouponUsage } from './coupon-usage.entity';

@Entity('coupon')
@Unique(['code'])
export class Coupon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: false })
  code: string;

  @Column({ type: 'text', nullable: true })
  discount_type: string;

  @Column({ type: 'text', nullable: true })
  discount_desc: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  expires_at: Date;

  @OneToMany(() => CouponUsage, (usage) => usage.coupon)
  coupon_usages: CouponUsage[];
}
