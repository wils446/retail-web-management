import { User } from 'user/entities';

export class DeleteCartItemCommand {
  constructor(
    public readonly cartId: string,
    public readonly cartItemId: string,
    public readonly user: User,
  ) {}
}
