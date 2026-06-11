import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from '../../database/entities/cart-item.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Admin - CartItems')
@Controller('admin/cart-items')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth('access-token')
export class AdminCartItemsController {
  constructor(@InjectRepository(CartItem) private repo: Repository<CartItem>) {}

  @Get()
  async list(@Query('page') page = '1', @Query('limit') limit = '50') {
    const p = Number(page), l = Number(limit);
    const [items, total] = await this.repo.findAndCount({ skip: (p-1)*l, take: l });
    return { items, total, page: p, limit: l, pages: Math.ceil(total / l) };
  }

  @Get(':id')
  async get(@Param('id') id: string) { return this.repo.findOne({ where: { id: Number(id) } }); }

  @Post()
  async create(@Body() body: any) { const e = this.repo.create(body as any); return this.repo.save(e); }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) { await this.repo.update(Number(id), body as any); return this.repo.findOne({ where: { id: Number(id) } }); }

  @Delete(':id')
  async delete(@Param('id') id: string) { return this.repo.delete({ id: Number(id) }); }
}
