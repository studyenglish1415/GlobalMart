import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentMethod } from '../../database/entities/payment-method.entity';
import { Payment } from '../../database/entities/payment.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(PaymentMethod)
    private paymentMethodRepo: Repository<PaymentMethod>,
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>
  ) {}

  async getPaymentMethods() {
    return this.paymentMethodRepo.find();
  }

  async createPayment(data: {
    order_id: number;
    payment_method_id: number;
    amount: number;
  }) {
    const payment = this.paymentRepo.create({
      ...data,
      status: 'pending',
    });
    return this.paymentRepo.save(payment);
  }

  async updatePaymentStatus(id: number, status: string) {
    const payment = await this.paymentRepo.findOne({ where: { id } });
    if (payment) {
      payment.status = status;
      return this.paymentRepo.save(payment);
    }
    return null;
  }
}
