export * from './get-histories';

import { Provider } from '@nestjs/common';

import { GetHistoriesHandler } from './get-histories';

export const QueryHandlers: Provider[] = [GetHistoriesHandler];
