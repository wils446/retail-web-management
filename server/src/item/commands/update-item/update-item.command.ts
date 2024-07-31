import { UpdateItemDto } from 'item/dtos';
import { User } from 'user/entities';

export class UpdateItemCommand {
  constructor(
    public readonly itemId: string,
    public readonly updateItemData: UpdateItemDto,
    public readonly user: User,
  ) {}
}
