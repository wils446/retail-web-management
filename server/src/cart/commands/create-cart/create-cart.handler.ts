import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { Cart } from 'cart/entities';
import { CartRepository } from 'cart/repositories';
import { CreateCartCommand } from './create-cart.command';
import { DataSource, QueryRunner } from 'typeorm';
import { History } from 'history/entities';
import { error } from 'console';

@CommandHandler(CreateCartCommand)
export class CreateCartHandler implements ICommandHandler<CreateCartCommand> {
  queryRunner: QueryRunner;

  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: CartRepository,
    private readonly dataSource: DataSource,
  ) {}

  async execute(command: CreateCartCommand): Promise<any> {
    this.queryRunner = this.dataSource.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
    try {
      const cart = await this.createCart(command);
      await this.createHistory(command);
      await this.queryRunner.commitTransaction();
      return cart;
    } catch (err) {
      await this.queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await this.queryRunner.release();
    }
  }

  async createCart(command: CreateCartCommand) {
    let cart = await this.cartRepository.findOneBy({
      name: command.cartData.name,
    });
    if (cart && command.cartData.name)
      throw new ConflictException(
        `cart with name ${command.cartData.name} is already exists`,
      );

    cart = await this.cartRepository.create({ name: command.cartData.name });

    try {
      await this.queryRunner.manager.save(cart);
      return cart;
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }

  async createHistory(command: CreateCartCommand) {
    const historyRepo = await this.queryRunner.manager.getRepository(History);
    try {
      const history = await historyRepo.create({
        text: `${command.user.username} menambahkan cart`,
        type: 'create',
      });
      await historyRepo.save(history);
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }
}
