export * from './create-history';

import { Provider } from '@nestjs/common';

import { CreateHistoryHandler } from './create-history';

export const CommandHandlers: Provider[] = [CreateHistoryHandler];
