import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ReviewsService } from '../reviews/reviews.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Admin - Reviews')
@Controller('admin/reviews')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth('access-token')
export class AdminReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  @ApiOperation({ summary: 'List reviews' })
  async list(@Query('page') page = '1', @Query('limit') limit = '20') {
    return this.reviewsService.listAll(Number(page), Number(limit));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get review' })
  async get(@Param('id') id: string) {
    return this.reviewsService.findById(Number(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update review' })
  async update(@Param('id') id: string, @Body() body: any) {
    return this.reviewsService.updateAdmin(Number(id), body as any);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete review' })
  async delete(@Param('id') id: string) {
    return this.reviewsService.deleteAdmin(Number(id));
  }
}
