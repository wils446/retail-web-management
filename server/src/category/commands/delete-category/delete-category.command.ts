import { User } from 'user/entities';

export class DeleteCategoryCommand {
  constructor(
    public readonly categoryId: string,
    public readonly user: User,
  ) {}
}
