import { Module } from '@nestjs/common';

import { TransactionModule } from 'transaction/transaction.module';
import { QueryHandlers } from './queries';
import { OrderModule } from 'order/order.module';
import { ReturnModule } from 'return/return.module';

@Module({
  imports: [TransactionModule, OrderModule, ReturnModule],
  providers: [...QueryHandlers],
})
export class DailyReportModule {}
