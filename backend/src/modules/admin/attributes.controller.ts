import { Controller, Post, Body, UseGuards, Patch, Param, Delete } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { CreateAttributeDto, UpdateAttributeDto } from '../products/dto/attribute.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Admin - Attributes')
@Controller('admin/attributes')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth('access-token')
export class AdminAttributesController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Create an attribute for a product' })
  async create(@Body() dto: CreateAttributeDto) {
    return this.productsService.createAttribute(dto as any);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an attribute' })
  async update(@Param('id') id: number, @Body() dto: UpdateAttributeDto) {
    return this.productsService.updateAttribute(Number(id), dto as any);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an attribute' })
  async delete(@Param('id') id: number) {
    return this.productsService.deleteAttribute(Number(id));
  }
}
