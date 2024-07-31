export * from './create-order';
export * from './update-order';

import { Provider } from '@nestjs/common';
import { CreateOrderHandler } from './create-order';
import { UpdateOrderHandler } from './update-order';

export const CommandHandlers: Provider[] = [
  CreateOrderHandler,
  UpdateOrderHandler,
];
