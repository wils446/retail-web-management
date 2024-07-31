import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import {
  AuthController,
  CartController,
  CategoryController,
  HistoryController,
  ItemController,
  MeController,
  TransactionController,
  UserController,
  OrderController,
  ReturnController,
  DailyReportController,
} from './controllers';

@Module({
  imports: [CqrsModule],
  controllers: [
    AuthController,
    MeController,
    UserController,
    ItemController,
    CategoryController,
    CartController,
    HistoryController,
    TransactionController,
    OrderController,
    ReturnController,
    DailyReportController,
  ],
})
export class ApiModule {}
