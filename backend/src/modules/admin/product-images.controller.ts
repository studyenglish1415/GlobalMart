import { Controller, Post, Body, UseGuards, Patch, Param, Delete, Get } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { CreateProductImageDto, UpdateProductImageDto } from '../products/dto/product-image.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { BulkCreateImagesDto } from '../products/dto/bulk-images.dto';

@ApiTags('Admin - Product Images')
@Controller('admin/product-images')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth('access-token')
export class AdminProductImagesController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a product image' })
  async create(@Body() dto: CreateProductImageDto) {
    return this.productsService.createProductImage(dto as any);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Bulk upload product images' })
  async bulkCreate(@Body() dto: BulkCreateImagesDto) {
    return this.productsService.bulkCreateProductImages(dto.product_id, dto.image_urls);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product image' })
  async update(@Param('id') id: number, @Body() dto: UpdateProductImageDto) {
    return this.productsService.updateProductImage(Number(id), dto as any);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product image' })
  async delete(@Param('id') id: number) {
    return this.productsService.deleteProductImage(Number(id));
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'List product images for a product' })
  async listByProduct(@Param('productId') productId: number) {
    return this.productsService.listProductImages(Number(productId));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product image by id' })
  async getOne(@Param('id') id: number) {
    return this.productsService.getProductImage(Number(id));
  }
}
