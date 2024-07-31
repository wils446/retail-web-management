import { GetTransactionsQueryDto } from 'transaction/dtos/get-transactions-query.dto';

export class GetTransactionsQuery {
  constructor(public readonly query: GetTransactionsQueryDto) {}
}
