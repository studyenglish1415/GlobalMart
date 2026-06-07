import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../../database/entities/cart.entity';
import { CartItem } from '../../database/entities/cart-item.entity';
import { ProductItem } from '../../database/entities/product-item.entity';
import { CartItemDto, UpdateCartItemDto } from './dto/cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepo: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepo: Repository<CartItem>,
    @InjectRepository(ProductItem)
    private productItemRepo: Repository<ProductItem>
  ) {}

  async getOrCreateCart(userId: number): Promise<Cart> {
    let cart = await this.cartRepo.findOne({
      where: { user_id: userId },
      relations: ['cart_items', 'cart_items.product_item'],
    });

    if (!cart) {
      cart = this.cartRepo.create({ user_id: userId });
      await this.cartRepo.save(cart);
    }

    return cart;
  }

  async getCart(userId: number) {
    const cart = await this.getOrCreateCart(userId);
    return this.cartRepo.findOne({
      where: { id: cart.id },
      relations: [
        'cart_items',
        'cart_items.product_item',
        'cart_items.product_item.product',
      ],
    });
  }

  async addItem(userId: number, itemDto: CartItemDto) {
    const cart = await this.getOrCreateCart(userId);
    const productItem = await this.productItemRepo.findOne({
      where: { id: itemDto.product_item_id },
    });

    if (!productItem) {
      throw new NotFoundException('Product item not found');
    }

    let cartItem: CartItem | null = await this.cartItemRepo.findOne({
      where: { cart_id: cart.id, var_product_id: itemDto.product_item_id },
    });

    if (cartItem) {
      cartItem.quantity += itemDto.quantity;
    } else {
      // construct a plain object and cast to `CartItem` to avoid overload
      cartItem = ({
        cart_id: cart.id,
        var_product_id: itemDto.product_item_id,
        quantity: itemDto.quantity,
      } as unknown) as CartItem;
    }

    return this.cartItemRepo.save(cartItem);
  }

  async updateItem(
    userId: number,
    itemId: number,
    updateDto: UpdateCartItemDto
  ) {
    const cart = await this.getOrCreateCart(userId);
    const cartItem = await this.cartItemRepo.findOne({
      where: { id: itemId, cart_id: cart.id },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    cartItem.quantity = updateDto.quantity;
    return this.cartItemRepo.save(cartItem);
  }

  async removeItem(userId: number, itemId: number) {
    const cart = await this.getOrCreateCart(userId);
    const cartItem = await this.cartItemRepo.findOne({
      where: { id: itemId, cart_id: cart.id },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    return this.cartItemRepo.remove(cartItem);
  }

  async clearCart(userId: number) {
    const cart = await this.getOrCreateCart(userId);
    await this.cartItemRepo.delete({ cart_id: cart.id });
  }
}
