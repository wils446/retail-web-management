import { CreateOrderDto } from 'order/dtos';
import { User } from 'user/entities';

export class CreateOrderCommand {
  constructor(
    public readonly createOrderDto: CreateOrderDto,
    public readonly user: User,
  ) {}
}
