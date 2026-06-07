import { Controller, Post, Body, UseGuards, Patch, Param, Delete, Get, Request} from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { CreateProductDto, UpdateProductDto } from '../products/dto/admin-product.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Admin - Products')
@Controller('admin/products')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth('access-token')
export class AdminProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a product' })
  async create(@Body() dto: CreateProductDto) {
    return this.productsService.createProduct(dto as any);
  }

  @Get()
  @ApiOperation({ summary: 'Admin list products' })
  async list(@Param() params: any, @Request() req: any, @Body() body: any) {
    const page = Number((req.query && req.query.page) || 1);
    const limit = Number((req.query && req.query.limit) || 20);
    return this.productsService.adminListProducts(page, limit);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product' })
  async update(@Param('id') id: number, @Body() dto: UpdateProductDto) {
    return this.productsService.updateProduct(Number(id), dto as any);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product' })
  async delete(@Param('id') id: number) {
    return this.productsService.deleteProduct(Number(id));
  }
}
