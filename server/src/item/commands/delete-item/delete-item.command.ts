import { User } from 'user/entities';

export class DeleteItemCommand {
  constructor(
    public readonly itemId: string,
    public readonly user: User,
  ) {}
}
