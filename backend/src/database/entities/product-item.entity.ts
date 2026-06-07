import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('product_item')
export class ProductItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', nullable: false })
  product_id: number;

  @Column({ type: 'text', nullable: true })
  sku: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  weight: number;

  @ManyToOne(() => Product, (product) => product.product_items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
