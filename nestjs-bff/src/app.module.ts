import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { AppConfigModule } from './config/config.module';
import { MedusaModule } from './medusa/medusa.module';
import { ProductsModule } from './modules/products/products.module';
import { CartModule } from './modules/cart/cart.module';
import { CheckoutModule } from './modules/checkout/checkout.module';
import { AuthModule } from './modules/auth/auth.module';
import { OrdersModule } from './modules/orders/orders.module';
import { HealthModule } from './modules/health/health.module';
import { StoreModule } from './modules/store/store.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CollectionsModule } from './modules/collections/collections.module';
import { InventoryModule } from './modules/inventory/inventory.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    AppConfigModule,
    TerminusModule,
    MedusaModule,
    ProductsModule,
    CategoriesModule,
    CollectionsModule,
    InventoryModule,
    CartModule,
    CheckoutModule,
    AuthModule,
    OrdersModule,
    HealthModule,
    StoreModule,
  ],
})
export class AppModule {}
