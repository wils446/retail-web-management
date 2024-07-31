export * from './create-transaction';
export * from './update-transaction';
export * from './delete-transaction';

import { Provider } from '@nestjs/common';

import { CreateTransactionHandler } from './create-transaction';
import { UpdateTransactionHandler } from './update-transaction';
import { DeleteTransactionHandler } from './delete-transaction';

export const CommandHandlers: Provider[] = [
  CreateTransactionHandler,
  UpdateTransactionHandler,
  DeleteTransactionHandler,
];
