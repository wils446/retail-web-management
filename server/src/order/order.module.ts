import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { OrderItemRepository, OrderRepository } from './repositories';
import { CommandHandlers } from './commands';
import { QueryHandlers } from './queries';
import { ItemModule } from 'item/item.module';

@Module({
  imports: [CqrsModule, ItemModule],
  providers: [
    OrderRepository,
    OrderItemRepository,
    ...CommandHandlers,
    ...QueryHandlers,
  ],
  exports: [OrderItemRepository, OrderRepository],
})
export class OrderModule {}
