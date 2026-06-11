import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from '../../database/entities/product.entity';
import { Category } from '../../database/entities/category.entity';
import { Brand } from '../../database/entities/brand.entity';
import { ProductItem } from '../../database/entities/product-item.entity';
import { ProductImage } from '../../database/entities/product-image.entity';
import { Attribute } from '../../database/entities/attribute.entity';
import { AttributeVariant } from '../../database/entities/attribute-variant.entity';
import { Coupon } from '../../database/entities/coupon.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Category,
      Brand,
      ProductItem,
      ProductImage,
      Attribute,
      AttributeVariant,
      Coupon,
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
