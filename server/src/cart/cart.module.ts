import { Module, forwardRef } from '@nestjs/common';
import { CartItemRepository, CartRepository } from './repositories';
import { CommandHandlers } from './commands';
import { QueryHandlers } from './queries';
import { ItemModule } from 'item/item.module';

@Module({
  imports: [forwardRef(() => ItemModule)],
  providers: [
    CartRepository,
    CartItemRepository,
    ...CommandHandlers,
    ...QueryHandlers,
  ],
  exports: [CartRepository, CartItemRepository],
})
export class CartModule {}
