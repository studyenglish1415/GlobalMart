import { Controller, Post, Body, UseGuards, Patch, Param, Delete, Get } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { CreateProductItemDto, UpdateProductItemDto } from '../products/dto/product-item.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Admin - Product Items')
@Controller('admin/product-items')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth('access-token')
export class AdminProductItemsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a product item (variant)' })
  async create(@Body() dto: CreateProductItemDto) {
    return this.productsService.createProductItem(dto as any);
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'List product items for a product' })
  async listByProduct(@Param('productId') productId: number) {
    return this.productsService.listProductItems(Number(productId));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product item by id' })
  async getOne(@Param('id') id: number) {
    return this.productsService.getProductItem(Number(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product item' })
  async update(@Param('id') id: number, @Body() dto: UpdateProductItemDto) {
    return this.productsService.updateProductItem(Number(id), dto as any);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product item' })
  async delete(@Param('id') id: number) {
    return this.productsService.deleteProductItem(Number(id));
  }
}
