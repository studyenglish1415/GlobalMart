import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Admin - Product Items')
@Controller('admin/products/:productId/items')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth('access-token')
export class AdminProductItemsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'List product items' })
  async list(@Param('productId') productId: number) {
    return this.productsService.listProductItems(Number(productId));
  }

  @Post()
  @ApiOperation({ summary: 'Create product item' })
  async create(@Param('productId') productId: number, @Body() body: any) {
    body.product_id = Number(productId);
    return this.productsService.createProductItem(body as any);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update product item' })
  async update(@Param('id') id: number, @Body() body: any) {
    return this.productsService.updateProductItem(Number(id), body as any);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete product item' })
  async delete(@Param('id') id: number) {
    return this.productsService.deleteProductItem(Number(id));
  }
}

