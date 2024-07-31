import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'database/database.module';
import { databaseConfig, jwtConfig } from 'commons/configs';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ApiModule } from './api/api.module';
import { ItemModule } from './item/item.module';
import { CategoryModule } from './category/category.module';
import { CartModule } from './cart/cart.module';
import { TransactionModule } from './transaction/transaction.module';
import { HistoryModule } from './history/history.module';
import { OrderModule } from './order/order.module';
import { ReturnModule } from './return/return.module';
import { DailyReportModule } from './daily-report/daily-report.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [databaseConfig, jwtConfig], isGlobal: true }),
    DatabaseModule,
    UserModule,
    AuthModule,
    ApiModule,
    ItemModule,
    CategoryModule,
    CartModule,
    TransactionModule,
    HistoryModule,
    OrderModule,
    ReturnModule,
    DailyReportModule,
  ],
})
export class AppModule {}
