import { CreateCategoryDto } from 'category/dtos/create-category.dto';
import { User } from 'user/entities';

export class CreateCategoryCommand {
  constructor(
    public readonly categoryData: CreateCategoryDto,
    public readonly user: User,
  ) {}
}
