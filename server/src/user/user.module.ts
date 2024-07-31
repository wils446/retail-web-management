import { Module } from '@nestjs/common';

import { UserRepository } from './repositories';
import { CommandHandlers } from './commands';
import { QueryHandlers } from './queries';
import { UserSubscriber } from './subscribers';

@Module({
  providers: [
    UserRepository,
    ...CommandHandlers,
    ...QueryHandlers,
    UserSubscriber,
  ],
  exports: [UserRepository],
})
export class UserModule {}
