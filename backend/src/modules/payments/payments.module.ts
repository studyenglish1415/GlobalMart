import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PaymentMethod } from '../../database/entities/payment-method.entity';
import { Payment } from '../../database/entities/payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentMethod, Payment])],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
