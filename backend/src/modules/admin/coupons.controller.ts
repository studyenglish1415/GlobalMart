import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Admin - Coupons')
@Controller('admin/coupons')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth('access-token')
export class AdminCouponsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'List coupons' })
  async list() {
    return this.productsService.listCoupons ? this.productsService.listCoupons() : [];
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get coupon' })
  async get(@Param('id') id: number) {
    return this.productsService.getCoupon ? this.productsService.getCoupon(Number(id)) : null;
  }

  @Post()
  @ApiOperation({ summary: 'Create coupon' })
  async create(@Body() body: any) {
    return this.productsService.createCoupon(body as any);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update coupon' })
  async update(@Param('id') id: number, @Body() body: any) {
    return this.productsService.updateCoupon(Number(id), body as any);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete coupon' })
  async delete(@Param('id') id: number) {
    return this.productsService.deleteCoupon(Number(id));
  }
}
