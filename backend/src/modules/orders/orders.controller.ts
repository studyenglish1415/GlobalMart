import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'Get user orders' })
  async findAll(
    @Request() req: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return this.ordersService.findByUser(req.user.id, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order details' })
  async findOne(@Request() req: any, @Param('id') id: number) {
    return this.ordersService.findById(id, req.user.id);
  }

  @Get(':id/status-history')
  @ApiOperation({ summary: 'Get order status history' })
  async getStatusHistory(@Request() req: any, @Param('id') orderId: number) {
    return this.ordersService.getStatusHistory(orderId, req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new order from cart' })
  async create(@Request() req: any, @Body() createDto: CreateOrderDto) {
    return this.ordersService.create(req.user.id, createDto);
  }
}
