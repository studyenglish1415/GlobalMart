import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { OrdersService } from '../orders/orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Admin - Orders')
@Controller('admin/orders')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth('access-token')
export class AdminOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async list(@Param() params: any) {
    const page = Number((params && params.page) || 1);
    const limit = Number((params && params.limit) || 50);
    return this.ordersService.adminListOrders(page, limit);
  }

  @Get(':id')
  async get(@Param('id') id: number) {
    return this.ordersService.findByIdAdmin(Number(id));
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() body: any) {
    return this.ordersService.updateOrder(Number(id), body);
  }
}
