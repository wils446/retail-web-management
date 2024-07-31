import { InternalServerErrorException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, Raw } from 'typeorm';

import { Order } from 'order/entities';
import { OrderRepository } from 'order/repositories';
import { GetOrdersQuery } from './get-orders.query';
import {
  calculateDayStartAndEnd,
  LessThanOrEqualDate,
  MoreThanOrEqualDate,
} from 'commons/libs/utils';

type ExecuteReturnType = {
  count: number;
  orders: Order[];
};

@QueryHandler(GetOrdersQuery)
export class GetOrdersHandler implements IQueryHandler<GetOrdersQuery> {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute({ query }: GetOrdersQuery): Promise<ExecuteReturnType> {
    const page = +query.page - 1 || 0;
    const length = +query.length || 20;

    const where: FindOptionsWhere<Order> = {};

    if (query.name)
      where.name = Raw(
        (alias) => `LOWER(${alias}) Like '%${query.name.toLowerCase()}%'`,
      );
    if (query.paid) where.paid = query.paid === 'true';
    if (query.startDate) {
      if (query.endDate) {
        where.created_at = Between(
          new Date(query.startDate),
          new Date(query.endDate),
        );
      } else {
        where.created_at = MoreThanOrEqualDate(query.startDate);
      }
    } else if (query.endDate) {
      where.created_at = LessThanOrEqualDate(query.endDate);
    } else if (query.date) {
      const { dateEnd, dateStart } = calculateDayStartAndEnd(query.date);
      where.created_at = Between(dateStart, dateEnd);
    }

    try {
      const [orders, count] = await this.orderRepository.findAndCount({
        where,
        take: length,
        skip: page * length,
        order: {
          [query.sortField]: query.sortType,
          created_at: 'desc',
        },
      });
      return { orders, count };
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }
}
