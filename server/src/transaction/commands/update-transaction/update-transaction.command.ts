import { UpdateTransactionDto } from 'transaction/dtos';
import { User } from 'user/entities';

export class UpdateTransactionCommand {
  constructor(
    public readonly transactionId: string,
    public readonly transaction: UpdateTransactionDto,
    public readonly user: User,
  ) {}
}
