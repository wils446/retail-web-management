import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { DeleteCartCommand } from './delete-cart.command';
import { Cart } from 'cart/entities';
import { CartRepository } from 'cart/repositories';
import { DataSource, QueryRunner } from 'typeorm';
import { History } from 'history/entities';

@CommandHandler(DeleteCartCommand)
export class DeleteCartHandler implements ICommandHandler<DeleteCartCommand> {
  queryRunner: QueryRunner;

  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: CartRepository,
    private readonly dataSource: DataSource,
  ) {}

  async execute(command: DeleteCartCommand): Promise<{ message: string }> {
    this.queryRunner = this.dataSource.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
    try {
      const cart = await this.deleteCart(command);
      await this.createHistory(command, cart);
      await this.queryRunner.commitTransaction();
      return { message: `${command.cartId} deleted` };
    } catch (err) {
      await this.queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await this.queryRunner.release();
    }
  }

  async deleteCart(command: DeleteCartCommand) {
    const cartRepo = await this.queryRunner.manager.getRepository(Cart);
    const cart = await this.cartRepository.findOneBy({ id: command.cartId });
    const result = await cartRepo.delete({ id: command.cartId });
    if (result.affected === 0)
      throw new NotFoundException(
        `cart with id ${command.cartId} is not found`,
      );
    return cart;
  }

  async createHistory(command: DeleteCartCommand, deletedCart: Cart) {
    const historyRepo = await this.queryRunner.manager.getRepository(History);
    try {
      const history = await historyRepo.create({
        text: `${command.user.username} menghapus keranjang ${deletedCart.name}`,
        type: 'delete',
      });
      await historyRepo.save(history);
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }
}
