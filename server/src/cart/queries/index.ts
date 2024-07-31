export * from './get-carts';

import { Provider } from '@nestjs/common';

import { GetCartsHandler } from './get-carts';

export const QueryHandlers: Provider[] = [GetCartsHandler];
