import { AddCartItemDto } from 'cart/dtos';
import { User } from 'user/entities';

export class AddCartItemCommand {
  constructor(
    public readonly cartId: string,
    public readonly cardItem: AddCartItemDto,
    public readonly user: User,
  ) {}
}
