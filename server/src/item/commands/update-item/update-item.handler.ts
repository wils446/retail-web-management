import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { UpdateItemCommand } from './update-item.command';
import { Item } from 'item/entities';
import { ItemRepository } from 'item/repositories';
import { Category } from 'category/entities';
import { CategoryRepository } from 'category/repositories';
import { DataSource, QueryRunner } from 'typeorm';
import { History } from 'history/entities';

@CommandHandler(UpdateItemCommand)
export class UpdateItemHandler implements ICommandHandler<UpdateItemCommand> {
  queryRunner: QueryRunner;

  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: ItemRepository,
    @InjectRepository(Category)
    private readonly categoryRepository: CategoryRepository,
    private readonly dataSource: DataSource,
  ) {}

  async execute(command: UpdateItemCommand): Promise<Item> {
    this.queryRunner = await this.dataSource.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
    try {
      const { newItem, oldItem } = await this.updateItem(command);
      await this.createHistory(command, oldItem, newItem);
      await this.queryRunner.commitTransaction();
      return newItem;
    } catch (err) {
      await this.queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await this.queryRunner.release();
    }
  }

  async updateItem({ itemId, updateItemData }: UpdateItemCommand) {
    let item: Item;

    if (updateItemData.name) {
      item = await this.itemRepository.findOneBy({
        name: updateItemData.name,
      });
      if (item && itemId !== item.id)
        throw new ConflictException(
          `item with name ${updateItemData.name} is already exists`,
        );
    }

    item = await this.itemRepository.findOneByOrThrow({ id: itemId });
    const oldItem = { ...item };

    if (updateItemData.name) item.name = updateItemData.name;
    if (updateItemData.price) item.price = updateItemData.price;
    if (updateItemData.categoryId !== undefined) {
      const category = updateItemData.categoryId
        ? await this.categoryRepository.findOneBy({
            id: updateItemData.categoryId,
          })
        : null;

      if (!category && updateItemData.categoryId !== '')
        throw new NotFoundException(
          `category with id ${updateItemData.categoryId} is not found`,
        );

      item.category = category;
    }

    try {
      await this.queryRunner.manager.save(item);
      return { oldItem, newItem: item };
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }

  async createHistory(
    command: UpdateItemCommand,
    oldItem: Item,
    newItem: Item,
  ) {
    const historyRepo = this.queryRunner.manager.getRepository(History);
    try {
      const history = await historyRepo.create({
        text: `${command.user.username} melakukan perubahan pada barang ${oldItem.name}`,
        type: 'update',
        detail: JSON.stringify({ oldItem, newItem }),
      });
      await historyRepo.save(history);
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }
}
