import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Review } from './review.entity';

@Entity('review_images')
export class ReviewImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', nullable: false })
  review_id: number;

  @Column({ type: 'text', nullable: true })
  image_url: string;

  @ManyToOne(() => Review, (review) => review.images, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'review_id' })
  review: Review;
}
