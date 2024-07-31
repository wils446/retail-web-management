export * from './create-item';
export * from './delete-item';
export * from './update-item';

import { Provider } from '@nestjs/common';

import { CreateItemHandler } from './create-item';
import { DeleteItemHandler } from './delete-item';
import { UpdateItemHandler } from './update-item';

export const CommandHandlers: Provider[] = [
  CreateItemHandler,
  DeleteItemHandler,
  UpdateItemHandler,
];
