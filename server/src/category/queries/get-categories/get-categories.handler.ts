import { InternalServerErrorException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'category/entities';
import { CategoryRepository } from 'category/repositories';
import { GetCategoriesQuery } from './get-categories.query';

type ExecuteReturnType = {
  counts: number;
  categories: Category[];
};

@QueryHandler(GetCategoriesQuery)
export class GetCategoriesHandler implements IQueryHandler<GetCategoriesQuery> {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(): Promise<ExecuteReturnType> {
    try {
      const [categories, counts] = await this.categoryRepository.findAndCount();
      return {
        counts,
        categories,
      };
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }
}
