import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../database/entities/order.entity';
import { OrderItem } from '../../database/entities/order-item.entity';
import { OrderStatusHistory } from '../../database/entities/order-status-history.entity';
import { Cart } from '../../database/entities/cart.entity';
import { Coupon } from '../../database/entities/coupon.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepo: Repository<OrderItem>,
    @InjectRepository(OrderStatusHistory)
    private statusHistoryRepo: Repository<OrderStatusHistory>,
    @InjectRepository(Cart)
    private cartRepo: Repository<Cart>,
    @InjectRepository(Coupon)
    private couponRepo: Repository<Coupon>
  ) {}

  async findByUser(userId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [orders, total] = await this.orderRepo.findAndCount({
      where: { user_id: userId },
      relations: ['order_items', 'payments'],
      skip,
      take: limit,
      order: { created_at: 'DESC' },
    });
    return { orders, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async findById(id: number, userId: number) {
    const order = await this.orderRepo.findOne({
      where: { id, user_id: userId },
      relations: ['order_items', 'payments', 'status_history'],
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async create(userId: number, createDto: CreateOrderDto) {
    const cart = await this.cartRepo.findOne({
      where: { user_id: userId },
      relations: ['cart_items', 'cart_items.product_item'],
    });
    if (!cart) throw new BadRequestException('Cart not found');

    const order: Order = this.orderRepo.create({
      user_id: userId,
      total_price: 0,
      status: 'pending',
      currency: 'USD',
    });
    const savedOrder = await this.orderRepo.save(order);

    let totalPrice = 0;
    if (cart.cart_items && cart.cart_items.length > 0) {
      for (const cartItem of cart.cart_items) {
        const price = Number((cartItem.product_item as any).price || 0);
        totalPrice += price * cartItem.quantity;
        await this.orderItemRepo.save({
          order_id: savedOrder.id,
          var_product_id: (cartItem.product_item as any).id,
          quantity: cartItem.quantity,
          price,
        } as any);
      }
    }

    // if (createDto.coupon_code) {
    //   const coupon = await this.couponRepo.findOne({
    //     where: { code: createDto.coupon_code },
    //   });
    //   if (coupon) {
    //     const discount = (totalPrice * coupon.discount_percent) / 100;
    //     totalPrice -= discount;
    //   }
    // }

    savedOrder.total_price = totalPrice;
    await this.orderRepo.save(savedOrder);
    await this.addStatusHistory(savedOrder.id, 'pending', 'Order created');
    return savedOrder;
  }

  async getStatusHistory(orderId: number, userId: number) {
    await this.findById(orderId, userId);
    return this.statusHistoryRepo.find({
      where: { order_id: orderId },
      order: { created_at: 'DESC' },
    });
  }

  // Admin helpers
  async adminListOrders(page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;
    const [orders, total] = await this.orderRepo.findAndCount({
      relations: ['order_items', 'payments', 'user'],
      skip,
      take: limit,
      order: { created_at: 'DESC' },
    });
    return { orders, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async findByIdAdmin(id: number) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['order_items', 'payments', 'status_history', 'user'],
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateOrder(id: number, data: Partial<Order>) {
    await this.orderRepo.update(id, data as any);
    return this.orderRepo.findOne({ where: { id } });
  }

  private async addStatusHistory(
    orderId: number,
    status: string,
    comment: string
  ) {
    const history = this.statusHistoryRepo.create({
      order_id: orderId,
      status,
    });
    return this.statusHistoryRepo.save(history);
  }
}
