export * from './get-orders';
export * from './get-order-by-id';

import { Provider } from '@nestjs/common';

import { GetOrdersHandler } from './get-orders';
import { GetOrderByIdHandler } from './get-order-by-id';

export const QueryHandlers: Provider[] = [
  GetOrdersHandler,
  GetOrderByIdHandler,
];
