export * from './get-users';

import { Provider } from '@nestjs/common';
import { GetUsersHandler } from './get-users';

export const QueryHandlers: Provider[] = [GetUsersHandler];
