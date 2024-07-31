import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCategoryCommand } from './create-category.command';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'category/entities';
import { CategoryRepository } from 'category/repositories';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { History } from 'history/entities';

@CommandHandler(CreateCategoryCommand)
export class CreateCategoryHandler
  implements ICommandHandler<CreateCategoryCommand>
{
  queryRunner: QueryRunner;

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: CategoryRepository,
    private readonly dataSource: DataSource,
  ) {}

  async execute(command: CreateCategoryCommand): Promise<Category> {
    this.queryRunner = this.dataSource.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
    try {
      const category = await this.createCategory(command);
      await this.createHistory(command);
      await this.queryRunner.commitTransaction();
      return category;
    } catch (err) {
      await this.queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await this.queryRunner.release();
    }
  }

  async createCategory({ categoryData }: CreateCategoryCommand) {
    let category = await this.categoryRepository.findOneBy({
      name: categoryData.name,
    });
    if (category)
      throw new ConflictException(
        `category with name ${category.name} already exists`,
      );

    category = await this.categoryRepository.create({
      name: categoryData.name,
    });

    try {
      await this.queryRunner.manager.save(category);
      return category;
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }

  async createHistory(command: CreateCategoryCommand) {
    const historyRepo = await this.queryRunner.manager.getRepository(History);
    try {
      const history = await historyRepo.create({
        text: `${command.user.username} menambahkan kategori ${command.categoryData.name}`,
        type: 'create',
      });
      await historyRepo.save(history);
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }
}
