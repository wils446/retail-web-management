import { CreateTransactionDto } from 'transaction/dtos';
import { User } from 'user/entities';

export class CreateTransactionCommand {
  constructor(
    public readonly user: User,
    public readonly transaction: CreateTransactionDto,
  ) {}
}
