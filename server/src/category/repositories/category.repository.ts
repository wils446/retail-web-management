import { NotFoundException, Provider } from '@nestjs/common';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { Category } from 'category/entities';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';

export interface CategoryRepository extends Repository<Category> {
  findOneByOrThrow: (
    this: CategoryRepository,
    options: FindOptionsWhere<Category> | FindOptionsWhere<Category>[],
  ) => Promise<Category>;
}

export const customCategoryRepositoryMethods: Pick<
  CategoryRepository,
  'findOneByOrThrow'
> = {
  async findOneByOrThrow(options) {
    const category = await this.findOneBy(options);
    if (!category) throw new NotFoundException('category is not found');
    return category;
  },
};

export const CategoryRepository: Provider = {
  provide: getRepositoryToken(Category),
  inject: [getDataSourceToken()],
  useFactory: (dataSource: DataSource) => {
    return dataSource
      .getRepository(Category)
      .extend(customCategoryRepositoryMethods);
  },
};
