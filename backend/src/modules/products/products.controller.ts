import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProductQueryDto } from './dto/product-query.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('categories')
  @ApiOperation({ summary: 'Get all product categories' })
  async getCategories() {
    return this.productsService.getCategories();
  }

  @Get('brands')
  @ApiOperation({ summary: 'Get all product brands' })
  async getBrands() {
    return this.productsService.getBrands();
  }

  @Get()
  @ApiOperation({ summary: 'List products with pagination and filters' })
  async findAll(@Query() query: ProductQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product details by ID' })
  async findById(@Param('id') id: number) {
    return this.productsService.findById(id);
  }

  @Get(':id/items')
  @ApiOperation({ summary: 'Get product items (variants) by product ID' })
  async getItems(@Param('id') id: number) {
    return this.productsService.listProductItems(Number(id));
  }

  @Get(':id/images')
  @ApiOperation({ summary: 'Get product images by product ID' })
  async getImages(@Param('id') id: number) {
    return this.productsService.listProductImages(Number(id));
  }
}
