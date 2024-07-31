import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateHistoryCommand } from './create-history.command';
import { HistoryRepository } from 'history/repositories';
import { History } from 'history/entities';

@CommandHandler(CreateHistoryCommand)
export class CreateHistoryHandler
  implements ICommandHandler<CreateHistoryCommand>
{
  constructor(
    @InjectRepository(History)
    private readonly historyRepository: HistoryRepository,
  ) {}

  async execute(command: CreateHistoryCommand): Promise<any> {
    const history = await this.historyRepository.create({
      text: `${command.user.username} ${command.history.text}`,
    });

    try {
      await this.historyRepository.save(history);
      return history;
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }
}
