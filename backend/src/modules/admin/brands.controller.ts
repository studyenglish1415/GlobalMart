import { Controller, Post, Body, UseGuards, Patch, Param, Delete } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { CreateBrandDto, UpdateBrandDto } from '../products/dto/brand-category.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Admin - Brands')
@Controller('admin/brands')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth('access-token')
export class AdminBrandsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a brand' })
  async create(@Body() dto: CreateBrandDto) {
    return this.productsService.createBrand(dto as any);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a brand' })
  async update(@Param('id') id: number, @Body() dto: UpdateBrandDto) {
    return this.productsService.updateBrand(Number(id), dto as any);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a brand' })
  async delete(@Param('id') id: number) {
    return this.productsService.deleteBrand(Number(id));
  }
}
