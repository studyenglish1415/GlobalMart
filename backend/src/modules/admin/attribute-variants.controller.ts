import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Admin - Attribute Variants')
@Controller('admin/attribute-variants')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth('access-token')
export class AdminAttributeVariantsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'List attribute variants' })
  async list() {
    return this.productsService.listAttributeVariants();
  }

  @Post()
  @ApiOperation({ summary: 'Create attribute variant' })
  async create(@Body() body: any) {
    return this.productsService.createAttributeVariant(body as any);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get attribute variant' })
  async get(@Param('id') id: number) {
    return this.productsService.getAttributeVariant(Number(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update attribute variant' })
  async update(@Param('id') id: number, @Body() body: any) {
    return this.productsService.updateAttributeVariant(Number(id), body as any);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete attribute variant' })
  async delete(@Param('id') id: number) {
    return this.productsService.deleteAttributeVariant(Number(id));
  }
}

