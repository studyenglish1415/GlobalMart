import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('brand')
@Index(['name'])
export class Brand {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text', nullable: true })
  country: string;

  @OneToMany(() => Product, (product) => product.brand)
  products: Product[];
}
