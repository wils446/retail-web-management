export * from './get-returns';
export * from './get-return-by-id';

import { Provider } from '@nestjs/common';

import { GetReturnsHandler } from './get-returns';
import { GetReturnByIdHandler } from './get-return-by-id';

export const QueryHandlers: Provider[] = [
  GetReturnsHandler,
  GetReturnByIdHandler,
];
