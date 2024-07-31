import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { Cart, CartItem } from 'cart/entities';
import { CartItemRepository, CartRepository } from 'cart/repositories';
import { Item } from 'item/entities';
import { ItemRepository } from 'item/repositories';
import { AddCartItemCommand } from './add-cart-item.command';
import { DataSource, QueryRunner } from 'typeorm';
import { History } from 'history/entities';

type ExecuteReturnType = {
  cartId: string;
  cartItem: CartItem;
};

@CommandHandler(AddCartItemCommand)
export class AddCartItemHandler implements ICommandHandler<AddCartItemCommand> {
  queryRunner: QueryRunner;

  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: ItemRepository,
    @InjectRepository(Cart)
    private readonly cartRepository: CartRepository,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: CartItemRepository,
    private readonly dataSource: DataSource,
  ) {}

  async execute(command: AddCartItemCommand): Promise<ExecuteReturnType> {
    this.queryRunner = this.dataSource.createQueryRunner();
    this.queryRunner.connect();
    this.queryRunner.startTransaction();
    try {
      const { cart, cartItem } = await this.addCartItem(command);
      await this.createHistory(command, cart, cartItem);
      await this.queryRunner.commitTransaction();
      return { cartId: cart.id, cartItem };
    } catch (err) {
      await this.queryRunner.rollbackTransaction();
      throw err;
    } finally {
      this.queryRunner.release();
    }
  }

  async addCartItem(command: AddCartItemCommand) {
    const item = await this.itemRepository.findOneOrThrow({
      where: {
        id: command.cardItem.itemId,
      },
      relations: { stocks: true },
    });

    const itemStock = item.stocks.reduce((prev, curr) => prev + curr.stock, 0);

    if (command.cardItem.quantity > itemStock)
      throw new ConflictException(
        'the requested quantity exceeds the available inventory',
      );

    const cart = await this.cartRepository.findOneByOrThrow({
      id: command.cartId,
    });

    let cartItem = await this.cartItemRepository.findOneBy({
      item: { id: item.id },
      cart: { id: cart.id },
    });
    if (!cartItem)
      cartItem = await this.cartItemRepository.create({
        item,
        cart,
        quantity: 0,
        name: item.name,
      });

    cartItem.quantity += command.cardItem.quantity;
    cartItem.price = command.cardItem.price
      ? command.cardItem.price
      : cartItem.quantity * item.price;

    try {
      await this.queryRunner.manager.save(cartItem);
      return { cart, cartItem };
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }

  async createHistory(
    command: AddCartItemCommand,
    cart: Cart,
    cartItem: CartItem,
  ) {
    const historyRepo = await this.queryRunner.manager.getRepository(History);
    try {
      const history = await historyRepo.create({
        text: `${command.user.username} menambahkan ${cartItem.name} pada keranjang ${cart.name}`,
        type: 'create',
      });
      await historyRepo.save(history);
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }
}
