import { Module } from '@nestjs/common';
import { HistoryRepository } from './repositories';
import { CommandHandlers } from './commands';
import { QueryHandlers } from './queries';

@Module({
  providers: [HistoryRepository, ...CommandHandlers, ...QueryHandlers],
  exports: [HistoryRepository],
})
export class HistoryModule {}
