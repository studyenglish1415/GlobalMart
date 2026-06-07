import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Product } from './product.entity';
import { AttributeVariant } from './attribute-variant.entity';

@Entity('attributes')
export class Attribute {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', nullable: false })
  product_id: number;

  @Column({ type: 'text', nullable: true })
  name: string;

  @ManyToOne(() => Product, (product) => product.attributes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @OneToMany(() => AttributeVariant, (variant) => variant.attribute, {
    onDelete: 'CASCADE',
  })
  attribute_variants: AttributeVariant[];
}
