import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { Category } from 'category/entities';
import { CategoryRepository } from 'category/repositories';
import { Item } from 'item/entities';
import { ItemRepository } from 'item/repositories';
import { CreateItemCommand } from './create-item.command';
import { DataSource, QueryRunner } from 'typeorm';
import { History } from 'history/entities';

@CommandHandler(CreateItemCommand)
export class CreateItemHandler implements ICommandHandler<CreateItemCommand> {
  private queryRunner: QueryRunner;

  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: ItemRepository,
    @InjectRepository(Category)
    private readonly categoryRepository: CategoryRepository,
    private readonly dataSource: DataSource,
  ) {}

  async execute(command: CreateItemCommand): Promise<Item> {
    this.queryRunner = this.dataSource.createQueryRunner();
    this.queryRunner.connect();
    this.queryRunner.startTransaction();

    try {
      const item = await this.createItem(command);
      await this.createHistory(command);
      await this.queryRunner.commitTransaction();
      return item;
    } catch (err) {
      await this.queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await this.queryRunner.release();
    }
  }

  async createItem({ createItemData }: CreateItemCommand) {
    let category: Category = null;
    let item = await this.itemRepository.findOneBy({
      name: createItemData.name,
    });

    if (item)
      throw new ConflictException(
        `item with name ${createItemData.name} already exists`,
      );

    if (createItemData.categoryId)
      category = await this.categoryRepository.findOneByOrThrow({
        id: createItemData.categoryId,
      });

    item = await this.itemRepository.create({
      name: createItemData.name,
      price: createItemData.price,
      category,
      stocks: null,
    });

    try {
      await this.queryRunner.manager.save(item);
      return item;
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }

  async createHistory({ createItemData, user }: CreateItemCommand) {
    const historyRepo = this.queryRunner.manager.getRepository(History);

    try {
      const history = await historyRepo.create({
        text: `${user.username} menambahkan barang ${createItemData.name}`,
        type: 'create',
      });
      await historyRepo.save(history);
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }
}
