import { InternalServerErrorException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { Cart } from 'cart/entities';
import { CartRepository } from 'cart/repositories';
import { UpdateCartCommand } from './update-cart.command';
import { DataSource, QueryRunner } from 'typeorm';
import { History } from 'history/entities';

@CommandHandler(UpdateCartCommand)
export class UpdateCartHandler implements ICommandHandler<UpdateCartCommand> {
  queryRunner: QueryRunner;

  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: CartRepository,
    private readonly dataSource: DataSource,
  ) {}

  async execute(command: UpdateCartCommand): Promise<any> {
    this.queryRunner = this.dataSource.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
    try {
      const { newCart, oldCart } = await this.updateCart(command);
      await this.createHistory(command, oldCart, newCart);
      await this.queryRunner.commitTransaction();
      return newCart;
    } catch (err) {
      await this.queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await this.queryRunner.release();
    }
  }

  async updateCart(command: UpdateCartCommand) {
    const cart = await this.cartRepository.findOneByOrThrow({
      id: command.cartId,
    });
    const oldCart = { ...cart };

    if (command.cartData.name) cart.name = command.cartData.name;

    try {
      await this.queryRunner.manager.save(cart);
      return { oldCart, newCart: cart };
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }

  async createHistory(
    command: UpdateCartCommand,
    oldCart: Cart,
    newCart: Cart,
  ) {
    const historyRepo = await this.queryRunner.manager.getRepository(History);
    try {
      const history = await historyRepo.create({
        text: `${command.user.username} melakukan perubahan pada keranjang ${oldCart.name}`,
        type: 'update',
        detail: JSON.stringify({ oldCart, newCart }),
      });
      await historyRepo.save(history);
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }
}
