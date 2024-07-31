import { UpdateCategoryDto } from 'category/dtos';
import { User } from 'user/entities';

export class UpdateCategoryCommand {
  constructor(
    public readonly categoryId: string,
    public readonly categoryData: UpdateCategoryDto,
    public readonly user: User,
  ) {}
}
