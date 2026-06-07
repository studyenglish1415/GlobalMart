import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Check,
} from 'typeorm';
import { Cart } from './cart.entity';
import { ProductItem } from './product-item.entity';

@Entity('cart_item')
@Check(`"quantity" > 0`)
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', nullable: false })
  cart_id: number;

  @Column({ type: 'integer', nullable: false })
  var_product_id: number;

  @Column({ type: 'integer', nullable: false })
  quantity: number;

  @ManyToOne(() => Cart, (cart) => cart.cart_items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  @ManyToOne(() => ProductItem)
  @JoinColumn({ name: 'var_product_id' })
  product_item: ProductItem;
}
