import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTransactionByIdQuery } from './get-transaction-by-id.query';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionRepository } from 'transaction/repositories';
import { Transaction } from 'transaction/entities';

@QueryHandler(GetTransactionByIdQuery)
export class GetTransactionByIdHandler
  implements IQueryHandler<GetTransactionByIdQuery>
{
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async execute(query: GetTransactionByIdQuery) {
    const transaction = await this.transactionRepository.findOneOrThrow({
      where: {
        id: query.transactionId,
      },
      relations: {
        items: true,
        checkoutUser: true,
        return: true,
      },
    });

    return transaction;
  }
}
