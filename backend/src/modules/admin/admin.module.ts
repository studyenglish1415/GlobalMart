import { Module } from '@nestjs/common';
import { ProductsModule } from '../products/products.module';
import { AuthModule } from '../auth/auth.module';
import { AdminProductsController } from './products.controller';
import { AdminBrandsController } from './brands.controller';
import { AdminCategoriesController } from './categories.controller';
import { AdminProductItemsController } from './product-items.controller';
import { AdminProductImagesController } from './product-images.controller';
import { AdminAttributesController } from './attributes.controller';
import { AdminAttributeVariantsController } from './attribute-variants.controller';
import { AdminGuard } from '../../common/guards/admin.guard';

@Module({
  imports: [ProductsModule, AuthModule],
  controllers: [
    AdminProductsController,
    AdminBrandsController,
    AdminCategoriesController,
    AdminProductItemsController,
    AdminProductImagesController,
    AdminAttributesController,
    AdminAttributeVariantsController,
  ],
  providers: [AdminGuard],
})
export class AdminModule {}
