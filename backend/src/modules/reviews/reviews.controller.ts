import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateReviewDto } from './dto/review.dto';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('product/:productId')
  @ApiOperation({ summary: 'Get reviews for a product' })
  async findByProduct(
    @Param('productId') productId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return this.reviewsService.findByProduct(productId, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get review details' })
  async findOne(@Param('id') id: number) {
    return this.reviewsService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create new review' })
  async create(@Request() req: any, @Body() createDto: CreateReviewDto) {
    return this.reviewsService.create(req.user.id, createDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete review' })
  async delete(@Request() req: any, @Param('id') id: number) {
    return this.reviewsService.delete(id, req.user.id);
  }
}
