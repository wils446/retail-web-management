export * from './get-transactions';
export * from './get-transaction-by-id';

import { Provider } from '@nestjs/common';

import { GetTransactionshandler } from './get-transactions';
import { GetTransactionByIdHandler } from './get-transaction-by-id';

export const QueryHandlers: Provider[] = [
  GetTransactionshandler,
  GetTransactionByIdHandler,
];
