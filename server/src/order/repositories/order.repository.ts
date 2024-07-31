import { NotFoundException, Provider } from '@nestjs/common';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { Order } from 'order/entities';
import {
  DataSource,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

export interface OrderRepository extends Repository<Order> {
  findOneByOrThrow: (
    this: OrderRepository,
    options: FindOptionsWhere<Order> | FindOptionsWhere<Order>[],
  ) => Promise<Order>;
  findOneOrThrow: (
    this: OrderRepository,
    options: FindOneOptions<Order>,
  ) => Promise<Order>;
}

export const customOrderRepositoryMethods: Pick<
  OrderRepository,
  'findOneByOrThrow' | 'findOneOrThrow'
> = {
  async findOneByOrThrow(options) {
    const order = await this.findOneBy(options);
    if (!order) throw new NotFoundException('order is not found');
    return order;
  },
  async findOneOrThrow(options) {
    const order = await this.findOne(options);
    if (!order) throw new NotFoundException('order is not found');
    return order;
  },
};

export const OrderRepository: Provider = {
  provide: getRepositoryToken(Order),
  inject: [getDataSourceToken()],
  useFactory: (dataSource: DataSource) =>
    dataSource.getRepository(Order).extend(customOrderRepositoryMethods),
};
