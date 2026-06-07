import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Check,
} from 'typeorm';
import { Order } from './order.entity';
import { ProductItem } from './product-item.entity';
import { Address } from './address.entity';

@Entity('order_items')
@Check(`"quantity" > 0`)
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', nullable: false })
  order_id: number;

  @Column({ type: 'integer', nullable: false })
  var_product_id: number;

  @Column({ type: 'integer', nullable: false })
  quantity: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ type: 'integer', nullable: true })
  address_id: number;

  @ManyToOne(() => Order, (order) => order.order_items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => ProductItem)
  @JoinColumn({ name: 'var_product_id' })
  product_item: ProductItem;

  @ManyToOne(() => Address, { nullable: true })
  @JoinColumn({ name: 'address_id' })
  address: Address;
}
