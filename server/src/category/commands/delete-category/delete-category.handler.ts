import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteCategoryCommand } from './delete-category.command';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'category/entities';
import { CategoryRepository } from 'category/repositories';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { History } from 'history/entities';

@CommandHandler(DeleteCategoryCommand)
export class DeleteCategoryHandler
  implements ICommandHandler<DeleteCategoryCommand>
{
  queryRunner: QueryRunner;

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: CategoryRepository,
    private readonly dataSource: DataSource,
  ) {}

  async execute(command: DeleteCategoryCommand): Promise<{ message: string }> {
    this.queryRunner = this.dataSource.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
    try {
      const category = await this.deleteCategory(command);
      await this.createHistory(command, category);
      await this.queryRunner.commitTransaction();
      return { message: `${command.categoryId} deleted` };
    } catch (err) {
      await this.queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await this.queryRunner.release();
    }
  }

  async deleteCategory(command: DeleteCategoryCommand) {
    const categoryRepo = await this.queryRunner.manager.getRepository(Category);
    const category = await this.categoryRepository.findOneBy({
      id: command.categoryId,
    });
    const result = await categoryRepo.delete({ id: command.categoryId });
    if (result.affected === 0)
      throw new NotFoundException(
        `category with id ${command.categoryId} is not found`,
      );
    return category;
  }

  async createHistory(
    command: DeleteCategoryCommand,
    deletedCategory: Category,
  ) {
    const historyRepo = await this.queryRunner.manager.getRepository(History);
    try {
      const history = await historyRepo.create({
        text: `${command.user.username} menghapus kategori ${deletedCategory.name}`,
        type: 'delete',
      });
      await historyRepo.save(history);
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }
}
