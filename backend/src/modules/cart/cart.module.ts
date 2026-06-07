import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Cart } from '../../database/entities/cart.entity';
import { CartItem } from '../../database/entities/cart-item.entity';
import { ProductItem } from '../../database/entities/product-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem, ProductItem])],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
