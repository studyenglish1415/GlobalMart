import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('methods')
  @ApiOperation({ summary: 'Get available payment methods' })
  async getPaymentMethods() {
    return this.paymentsService.getPaymentMethods();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create payment' })
  async createPayment(
    @Body()
    data: {
      order_id: number;
      payment_method_id: number;
      amount: number;
    }
  ) {
    return this.paymentsService.createPayment(data);
  }
}
