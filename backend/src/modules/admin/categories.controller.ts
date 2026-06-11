import { Controller, Post, Body, UseGuards, Patch, Param, Delete } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { CreateCategoryDto, UpdateCategoryDto } from '../products/dto/brand-category.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Admin - Categories')
@Controller('admin/categories')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth('access-token')
export class AdminCategoriesController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'List categories' })
  async list() {
    return this.productsService.getCategories();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by id' })
  async get(@Param('id') id: number) {
    return this.productsService.getCategories().then(cs => cs.find(c => c.id === Number(id)));
  }

  @Post()
  @ApiOperation({ summary: 'Create a category' })
  async create(@Body() dto: CreateCategoryDto) {
    return this.productsService.createCategory(dto as any);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a category' })
  async update(@Param('id') id: number, @Body() dto: UpdateCategoryDto) {
    return this.productsService.updateCategory(Number(id), dto as any);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category' })
  async delete(@Param('id') id: number) {
    return this.productsService.deleteCategory(Number(id));
  }
}
