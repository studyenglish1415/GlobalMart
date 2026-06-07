import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Payment } from './payment.entity';

@Entity('payment_method')
export class PaymentMethod {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: false })
  name: string;

  @OneToMany(() => Payment, (payment) => payment.payment_method)
  payments: Payment[];
}
