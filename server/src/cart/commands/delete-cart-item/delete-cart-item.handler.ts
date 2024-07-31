import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { Cart, CartItem } from 'cart/entities';
import { CartItemRepository, CartRepository } from 'cart/repositories';
import { DeleteCartItemCommand } from './delete-cart-item.command';
import { DataSource, QueryRunner } from 'typeorm';
import { History } from 'history/entities';

@CommandHandler(DeleteCartItemCommand)
export class DeleteCartItemHandler
  implements ICommandHandler<DeleteCartItemCommand>
{
  queryRunner: QueryRunner;

  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepository: CartItemRepository,
    @InjectRepository(Cart)
    private readonly cartRepository: CartRepository,
    private readonly dataSource: DataSource,
  ) {}

  async execute(command: DeleteCartItemCommand): Promise<{ message: string }> {
    this.queryRunner = this.dataSource.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
    try {
      const { cart, cartItem } = await this.deleteCartItem(command);
      await this.createHistory(command, cart, cartItem);
      await this.queryRunner.commitTransaction();
      return {
        message: `${command.cartItemId} deleted from ${command.cartId}`,
      };
    } catch (err) {
      await this.queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await this.queryRunner.release();
    }
  }

  async deleteCartItem(command: DeleteCartItemCommand) {
    const cartItemRepo = await this.queryRunner.manager.getRepository(CartItem);

    const cart = await this.cartRepository.findOneByOrThrow({
      id: command.cartId,
    });
    const cartItem = await this.cartItemRepository.findOneByOrThrow({
      id: command.cartItemId,
    });

    const result = await cartItemRepo.delete({
      id: cartItem.id,
      cart: { id: cart.id },
    });

    if (result.affected === 0)
      throw new NotFoundException(
        `cart item with id ${command.cartItemId} is not found`,
      );

    return { cart, cartItem };
  }

  async createHistory(
    command: DeleteCartItemCommand,
    cart: Cart,
    deletedCartItem: CartItem,
  ) {
    const historyRepo = await this.queryRunner.manager.getRepository(History);
    try {
      const history = await historyRepo.create({
        text: `${command.user.username} menghapus ${deletedCartItem.name} dari ${cart.name}`,
        type: 'delete',
      });
      await historyRepo.save(history);
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }
}
