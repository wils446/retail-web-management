import { UpdateOrderDto } from 'order/dtos';
import { User } from 'user/entities';

export class UpdateOrderCommand {
  constructor(
    public readonly orderId: string,
    public readonly updateOrder: UpdateOrderDto,
    public readonly user: User,
  ) {}
}
