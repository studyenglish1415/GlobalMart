import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Admin - Attributes')
@Controller('admin/attributes')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth('access-token')
export class AdminAttributesController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'List attributes' })
  async list() {
    return this.productsService.listAttributes();
  }

  @Post()
  @ApiOperation({ summary: 'Create attribute' })
  async create(@Body() body: any) {
    return this.productsService.createAttribute(body as any);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get attribute' })
  async get(@Param('id') id: number) {
    return this.productsService.getAttribute(Number(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update attribute' })
  async update(@Param('id') id: number, @Body() body: any) {
    return this.productsService.updateAttribute(Number(id), body as any);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete attribute' })
  async delete(@Param('id') id: number) {
    return this.productsService.deleteAttribute(Number(id));
  }
}

