import { CreateHistoryDto } from 'history/dtos';
import { User } from 'user/entities';

export class CreateHistoryCommand {
  constructor(
    public readonly user: User,
    public readonly history: CreateHistoryDto,
  ) {}
}
