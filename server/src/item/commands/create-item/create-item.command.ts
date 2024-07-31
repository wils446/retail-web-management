import { CreateItemDto } from 'item/dtos';
import { User } from 'user/entities';

export class CreateItemCommand {
  constructor(
    public readonly createItemData: CreateItemDto,
    public readonly user: User,
  ) {}
}
