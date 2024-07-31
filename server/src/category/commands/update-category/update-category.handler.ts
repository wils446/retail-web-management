import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { Category } from 'category/entities';
import { CategoryRepository } from 'category/repositories';
import { UpdateCategoryCommand } from './update-category.command';
import { DataSource, QueryRunner } from 'typeorm';
import { History } from 'history/entities';

@CommandHandler(UpdateCategoryCommand)
export class UpdateCategoryHandler
  implements ICommandHandler<UpdateCategoryCommand>
{
  queryRunner: QueryRunner;

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: CategoryRepository,
    private readonly dataSource: DataSource,
  ) {}

  async execute(command: UpdateCategoryCommand): Promise<Category> {
    this.queryRunner = this.dataSource.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
    try {
      const { newCategory, oldCategory } = await this.updateCategory(command);
      await this.createHistory(command, oldCategory, newCategory);
      await this.queryRunner.commitTransaction();
      return newCategory;
    } catch (err) {
      await this.queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await this.queryRunner.release();
    }
  }

  async updateCategory(command: UpdateCategoryCommand) {
    let category = await this.categoryRepository.findOneBy({
      name: command.categoryData.name,
    });
    if (category && category.id !== command.categoryId)
      throw new ConflictException(
        `category with name ${command.categoryData.name} is already exists`,
      );

    category = await this.categoryRepository.findOneByOrThrow({
      id: command.categoryId,
    });
    const oldCategory = { ...category };

    if (command.categoryData.name) category.name = command.categoryData.name;

    try {
      await this.queryRunner.manager.save(category);
      return { oldCategory, newCategory: category };
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }

  async createHistory(
    command: UpdateCategoryCommand,
    oldCategory: Category,
    newCategory: Category,
  ) {
    const historyRepo = await this.queryRunner.manager.getRepository(History);
    try {
      const history = await historyRepo.create({
        text: `${command.user.username} mengubah kategori ${oldCategory.name}`,
        type: 'update',
        detail: JSON.stringify({ oldCategory, newCategory }),
      });
      await historyRepo.save(history);
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }
}
