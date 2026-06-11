import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../../database/entities/review.entity';
import { CreateReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepo: Repository<Review>
  ) {}

  async findByProduct(productId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [reviews, total] = await this.reviewRepo.findAndCount({
      where: { product_id: productId },
      relations: ['user'],
      skip,
      take: limit,
    });

    return { reviews, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async findById(id: number) {
    const review = await this.reviewRepo.findOne({
      where: { id },
      relations: ['user', 'images'],
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  async create(userId: number, createDto: CreateReviewDto) {
    const review = this.reviewRepo.create({
      ...createDto,
      user_id: userId,
    });
    return this.reviewRepo.save(review);
  }

  async delete(id: number, userId: number) {
    const review = await this.findById(id);

    if (review.user_id !== userId) {
      throw new ForbiddenException("Cannot delete another user's review");
    }

    return this.reviewRepo.remove(review);
  }

  // Admin helpers
  async listAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [reviews, total] = await this.reviewRepo.findAndCount({ relations: ['user'], skip, take: limit });
    return { reviews, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async updateAdmin(id: number, data: Partial<Review>) {
    await this.reviewRepo.update(id, data as any);
    return this.reviewRepo.findOne({ where: { id }, relations: ['user', 'images'] });
  }

  async deleteAdmin(id: number) {
    return this.reviewRepo.delete({ id });
  }
}
