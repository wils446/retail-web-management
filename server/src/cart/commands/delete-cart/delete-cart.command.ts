import { User } from 'user/entities';

export class DeleteCartCommand {
  constructor(
    public readonly cartId: string,
    public readonly user: User,
  ) {}
}
