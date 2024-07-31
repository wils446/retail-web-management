import { UpdateCartDto } from 'cart/dtos';
import { User } from 'user/entities';

export class UpdateCartCommand {
  constructor(
    public readonly cartId: string,
    public readonly cartData: UpdateCartDto,
    public readonly user: User,
  ) {}
}
