import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('category')
@Index(['name'])
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'integer', nullable: true })
  parent_id: number;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @OneToMany(() => Category, (category) => category.parent_id, {
    nullable: true,
  })
  subcategories: Category[];
}
