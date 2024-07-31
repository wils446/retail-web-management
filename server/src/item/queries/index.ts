export * from './get-items';
export * from './get-item-by-id';

import { Provider } from '@nestjs/common';

import { GetItemsHandler } from './get-items';
import { GetItemByIdHandler } from './get-item-by-id';

export const QueryHandlers: Provider[] = [GetItemsHandler, GetItemByIdHandler];
