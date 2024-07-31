export * from './create-return';

import { Provider } from '@nestjs/common';
import { CreateReturnHandler } from './create-return';

export const CommandHandlers: Provider[] = [CreateReturnHandler];
