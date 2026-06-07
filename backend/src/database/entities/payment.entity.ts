import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { PaymentMethod } from './payment-method.entity';
import { Refund } from './refund.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', nullable: true })
  payment_method_id: number;

  @Column({ type: 'integer', nullable: false })
  order_id: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: false })
  amount: number;

  @Column({ type: 'text', nullable: true })
  status: string;

  @Column({ type: 'text', nullable: true })
  transaction_id: string;

  @ManyToOne(() => Order, (order) => order.payments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => PaymentMethod, { nullable: true })
  @JoinColumn({ name: 'payment_method_id' })
  payment_method: PaymentMethod;

  @OneToMany(() => Refund, (refund) => refund.payment, {
    onDelete: 'CASCADE',
  })
  refunds: Refund[];
}
