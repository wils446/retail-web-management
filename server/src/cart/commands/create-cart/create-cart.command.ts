import { CreateCartDto } from 'cart/dtos';
import { User } from 'user/entities';

export class CreateCartCommand {
  constructor(
    public readonly cartData: CreateCartDto,
    public readonly user: User,
  ) {}
}
