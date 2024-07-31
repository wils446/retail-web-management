import { Module } from '@nestjs/common';

import { CartModule } from 'cart/cart.module';
import { ItemModule } from 'item/item.module';
import { CommandHandlers } from './commands';
import { QueryHandlers } from './queries';
import {
  TransactionAddressRepository,
  TransactionItemRepository,
  TransactionRepository,
} from './repositories';
import { TransactionItemStockRepository } from './repositories/transaction-item-stock.repository';

@Module({
  imports: [CartModule, ItemModule],
  providers: [
    TransactionRepository,
    TransactionItemStockRepository,
    TransactionItemRepository,
    TransactionAddressRepository,
    ...CommandHandlers,
    ...QueryHandlers,
  ],
  exports: [
    TransactionRepository,
    TransactionItemRepository,
    TransactionItemStockRepository,
  ],
})
export class TransactionModule {}
