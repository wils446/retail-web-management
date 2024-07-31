import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { Cart, CartItem } from 'cart/entities';
import { CartItemRepository, CartRepository } from 'cart/repositories';
import { Item } from 'item/entities';
import { ItemRepository } from 'item/repositories';
import { DataSource, QueryRunner } from 'typeorm';
import { DeleteItemCommand } from './delete-item.command';
import { History } from 'history/entities';

@CommandHandler(DeleteItemCommand)
export class DeleteItemHandler implements ICommandHandler<DeleteItemCommand> {
  queryRunner: QueryRunner;

  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: ItemRepository,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: CartItemRepository,
    @InjectRepository(Cart)
    private readonly cartRepository: CartRepository,
    private readonly dataSource: DataSource,
  ) {}

  async execute(command: DeleteItemCommand): Promise<{ message: string }> {
    this.queryRunner = await this.dataSource.createQueryRunner();
    this.queryRunner.connect();
    this.queryRunner.startTransaction();

    try {
      await this.removeItemFromCarts(command.itemId);
      const deletedItem = await this.deleteItem(command.itemId);
      await this.createHistory(command, deletedItem);
      await this.queryRunner.commitTransaction();
      return { message: `${command.itemId} deleted` };
    } catch (err) {
      await this.queryRunner.rollbackTransaction();
      return err;
    } finally {
      await this.queryRunner.release();
    }
  }

  async deleteItem(itemId: string) {
    const itemRepo = await this.queryRunner.manager.getRepository(Item);
    const item = await itemRepo.findOneBy({ id: itemId });
    const result = await itemRepo.delete({ id: itemId });
    if (result.affected === 0)
      throw new NotFoundException(`item with id ${itemId} is not found`);
    return item;
  }

  async removeItemFromCarts(itemId: string) {
    const cartItemRepo = await this.queryRunner.manager.getRepository(CartItem);
    const cartsItem = await this.cartItemRepository.find({
      where: {
        item: { id: itemId },
      },
      relations: { cart: true },
    });

    // TODO : remove checkout system
    const unCheckoutCarts = await Promise.all([
      ...cartsItem.map(
        async (cartItem) =>
          await this.cartRepository.findOne({
            where: [{ id: cartItem.cart.id }],
          }),
      ),
    ]);

    await Promise.all(
      unCheckoutCarts.map(async (cart) => {
        const result = await cartItemRepo.delete({
          cart: { id: cart.id },
        });

        if (result.affected === 0)
          throw new NotFoundException(`cart item is not found`);
      }),
    );
  }

  async createHistory({ user }: DeleteItemCommand, deletedItem: Item) {
    const historyRepo = await this.queryRunner.manager.getRepository(History);

    try {
      const history = await historyRepo.create({
        text: `${user.username} menghapus barang ${deletedItem.name}`,
        type: 'delete',
      });
      await historyRepo.save(history);
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }
}
