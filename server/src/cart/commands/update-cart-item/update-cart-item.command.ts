import { UpdateCartItemDto } from 'cart/dtos';

export class UpdateCartItemCommand {
  constructor(
    public readonly cartId: string,
    public readonly cartItemId: string,
    public readonly cartItem: UpdateCartItemDto,
  ) {}
}
