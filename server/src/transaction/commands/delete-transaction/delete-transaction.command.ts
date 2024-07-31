import { User } from 'user/entities';

export class DeleteTransactionCommand {
  constructor(
    public readonly transactionid: string,
    public readonly user: User,
  ) {}
}
