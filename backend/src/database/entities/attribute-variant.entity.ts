import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Attribute } from './attribute.entity';

@Entity('attributes_variants')
export class AttributeVariant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', nullable: false })
  attribute_id: number;

  @Column({ type: 'text', nullable: true })
  value: string;

  @ManyToOne(() => Attribute, (attribute) => attribute.attribute_variants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'attribute_id' })
  attribute: Attribute;
}
