import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Category } from './category.entity';
import { Brand } from './brand.entity';
import { ProductItem } from './product-item.entity';
import { ProductImage } from './product-image.entity';
import { Attribute } from './attribute.entity';
import { Review } from './review.entity';

@Entity('products')
@Index(['name'])
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'integer', nullable: true })
  brand_id: number;

  @Column({ type: 'integer', nullable: true })
  category_id: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @Column({ type: 'text', nullable: true })
  currency: string;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => Brand, (brand) => brand.products)
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @OneToMany(() => ProductItem, (item) => item.product, {
    onDelete: 'CASCADE',
  })
  product_items: ProductItem[];

  @OneToMany(() => ProductImage, (image) => image.product, {
    onDelete: 'CASCADE',
  })
  images: ProductImage[];

  @OneToMany(() => Attribute, (attribute) => attribute.product, {
    onDelete: 'CASCADE',
  })
  attributes: Attribute[];

  @OneToMany(() => Review, (review) => review.product, {
    onDelete: 'CASCADE',
  })
  reviews: Review[];
}
