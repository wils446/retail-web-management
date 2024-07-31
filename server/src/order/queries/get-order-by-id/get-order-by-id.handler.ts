import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOrderByIdQuery } from './get-order-by-id.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'order/entities';
import { OrderRepository } from 'order/repositories';

@QueryHandler(GetOrderByIdQuery)
export class GetOrderByIdHandler implements IQueryHandler<GetOrderByIdQuery> {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(query: GetOrderByIdQuery) {
    const order = await this.orderRepository.findOneOrThrow({
      where: {
        id: query.orderId,
      },
      relations: { createdBy: true, items: true, return: true },
    });

    return order;
  }
}
