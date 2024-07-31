import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ItemModule } from 'item/item.module';
import { OrderModule } from 'order/order.module';
import { TransactionModule } from 'transaction/transaction.module';
import { CommandHandlers } from './commands';
import { ReturnItemRepository, ReturnRepository } from './repositories';
import { QueryHandlers } from './queries';

@Module({
  imports: [CqrsModule, TransactionModule, OrderModule, ItemModule],
  providers: [
    ReturnRepository,
    ReturnItemRepository,
    ...CommandHandlers,
    ...QueryHandlers,
  ],
  exports: [ReturnItemRepository, ReturnRepository],
})
export class ReturnModule {}
