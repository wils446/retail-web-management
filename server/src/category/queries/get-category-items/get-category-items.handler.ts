import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCategoryItemsQuery } from './get-category-items.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'category/entities';
import { CategoryRepository } from 'category/repositories';
import { InternalServerErrorException } from '@nestjs/common';

@QueryHandler(GetCategoryItemsQuery)
export class GetCategoryItemsHandler
  implements IQueryHandler<GetCategoryItemsQuery>
{
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(query: GetCategoryItemsQuery): Promise<any> {
    try {
      return await this.categoryRepository.find({
        where: { id: query.categoryId },
        relations: { item: true },
      });
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }
}
