import { Module } from '@nestjs/common';
import { ProductsModule } from '../products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressesModule } from '../addresses/addresses.module';
import { ReviewsModule } from '../reviews/reviews.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { OrdersModule } from '../orders/orders.module';
import { AdminProductsController } from './products.controller';
import { AdminBrandsController } from './brands.controller';
import { AdminCategoriesController } from './categories.controller';
import { AdminProductItemsController } from './product-items.controller';
import { AdminProductImagesController } from './product-images.controller';
import { AdminAttributesController } from './attributes.controller';
import { AdminAttributeVariantsController } from './attribute-variants.controller';
import { AdminGuard } from '../../common/guards/admin.guard';
import { CouponUsage } from '../../database/entities/coupon-usage.entity';
import { Cart } from '../../database/entities/cart.entity';
import { CartItem } from '../../database/entities/cart-item.entity';
import { Payment } from '../../database/entities/payment.entity';
import { PaymentMethod } from '../../database/entities/payment-method.entity';
import { OrderStatusHistory } from '../../database/entities/order-status-history.entity';
import { OrderItem } from '../../database/entities/order-item.entity';
import { Refund } from '../../database/entities/refund.entity';
import { ReviewImage } from '../../database/entities/review-image.entity';
import { UserSession } from '../../database/entities/user-session.entity';

@Module({
  imports: [
    ProductsModule,
    AuthModule,
    UsersModule,
    OrdersModule,
    AddressesModule,
    ReviewsModule,
    TypeOrmModule.forFeature([
      CouponUsage,
      Cart,
      CartItem,
      Payment,
      PaymentMethod,
      OrderStatusHistory,
      OrderItem,
      Refund,
      ReviewImage,
      UserSession,
    ]),
  ],
  controllers: [
    AdminProductsController,
    AdminBrandsController,
    AdminCategoriesController,
    AdminProductItemsController,
    AdminProductImagesController,
    AdminAttributesController,
    AdminAttributeVariantsController,
    // new admin controllers
    (require('./admin-users.controller').AdminUsersController),
    (require('./admin-orders.controller').AdminOrdersController),
    (require('./coupons.controller').AdminCouponsController),
    (require('./admin-addresses.controller').AdminAddressesController),
    (require('./admin-reviews.controller').AdminReviewsController),
    (require('./admin-coupon-usages.controller').AdminCouponUsagesController),
    (require('./admin-carts.controller').AdminCartsController),
    (require('./admin-cart-items.controller').AdminCartItemsController),
    (require('./admin-payments.controller').AdminPaymentsController),
    (require('./admin-payment-methods.controller').AdminPaymentMethodsController),
    (require('./admin-order-status.controller').AdminOrderStatusController),
    (require('./admin-order-items.controller').AdminOrderItemsController),
    (require('./admin-refunds.controller').AdminRefundsController),
    (require('./admin-review-images.controller').AdminReviewImagesController),
    (require('./admin-user-sessions.controller').AdminUserSessionsController),
  ],
  providers: [AdminGuard],
})
export class AdminModule {}
