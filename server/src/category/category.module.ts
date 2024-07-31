import { Module } from '@nestjs/common';

import { CommandHandlers } from './commands';
import { QueryHandlers } from './queries';
import { CategoryRepository } from './repositories';

@Module({
  providers: [CategoryRepository, ...CommandHandlers, ...QueryHandlers],
  exports: [CategoryRepository],
})
export class CategoryModule {}
