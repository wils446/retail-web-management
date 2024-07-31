import { NotFoundException, Provider } from '@nestjs/common';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { OrderItem } from 'order/entities';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';

export interface OrderItemRepository extends Repository<OrderItem> {
  findOneByOrThrow: (
    this: OrderItemRepository,
    options: FindOptionsWhere<OrderItem> | FindOptionsWhere<OrderItem>[],
  ) => Promise<OrderItem>;
}

export const customOrderItemRepositoryMethods: Pick<
  OrderItemRepository,
  'findOneByOrThrow'
> = {
  async findOneByOrThrow(options) {
    const orderItem = this.findOneBy(options);
    if (!orderItem) throw new NotFoundException('order item is not found');
    return orderItem;
  },
};

export const OrderItemRepository: Provider = {
  provide: getRepositoryToken(OrderItem),
  inject: [getDataSourceToken()],
  useFactory: (dataSource: DataSource) =>
    dataSource
      .getRepository(OrderItem)
      .extend(customOrderItemRepositoryMethods),
};
