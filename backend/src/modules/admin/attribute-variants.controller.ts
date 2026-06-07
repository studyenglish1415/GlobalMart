import { Controller, Post, Body, UseGuards, Patch, Param, Delete, Get } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { CreateAttributeVariantDto, UpdateAttributeVariantDto } from '../products/dto/attribute-variant.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Admin - Attribute Variants')
@Controller('admin/attribute-variants')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth('access-token')
export class AdminAttributeVariantsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Create attribute variant' })
  async create(@Body() dto: CreateAttributeVariantDto) {
    return this.productsService.createAttributeVariant(dto as any);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update attribute variant' })
  async update(@Param('id') id: number, @Body() dto: UpdateAttributeVariantDto) {
    return this.productsService.updateAttributeVariant(Number(id), dto as any);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete attribute variant' })
  async delete(@Param('id') id: number) {
    return this.productsService.deleteAttributeVariant(Number(id));
  }

  @Get('by-attribute/:attributeId')
  @ApiOperation({ summary: 'List variants for an attribute' })
  async listByAttribute(@Param('attributeId') attributeId: number) {
    return this.productsService.listVariantsByAttribute(Number(attributeId));
  }
}
