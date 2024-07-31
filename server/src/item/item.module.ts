import { Module, forwardRef } from '@nestjs/common';

import { CommandHandlers } from './commands';
import { QueryHandlers } from './queries';
import { ItemRepository, ItemStockRepository } from './repositories';
import { CategoryModule } from 'category/category.module';
import { CartModule } from 'cart/cart.module';
import { HistoryModule } from 'history/history.module';

@Module({
  imports: [CategoryModule, forwardRef(() => CartModule), HistoryModule],
  providers: [
    ItemRepository,
    ItemStockRepository,
    ...CommandHandlers,
    ...QueryHandlers,
  ],
  exports: [ItemRepository, ItemStockRepository],
})
export class ItemModule {}
