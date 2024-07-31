import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { CartItem } from 'cart/entities';
import { CartItemRepository } from 'cart/repositories';
import { UpdateCartItemCommand } from './update-cart-item.command';

type ExecuteReturnType = {
  cartId: string;
  cartItem: CartItem;
};

@CommandHandler(UpdateCartItemCommand)
export class UpdateCartItemHandler
  implements ICommandHandler<UpdateCartItemCommand>
{
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepository: CartItemRepository,
  ) {}

  async execute(command: UpdateCartItemCommand): Promise<ExecuteReturnType> {
    const cartItem = await this.cartItemRepository.findOneOrThrow({
      where: {
        id: command.cartItemId,
        cart: {
          id: command.cartId,
        },
      },
      relations: {
        item: { stocks: true },
      },
    });

    const itemStock = cartItem.item.stocks.reduce(
      (prev, curr) => prev + curr.stock,
      0,
    );

    if (itemStock < command.cartItem.quantity)
      throw new ConflictException(
        'the requested quantity exceeds the available inventory',
      );

    if (command.cartItem.quantity)
      cartItem.quantity = command.cartItem.quantity;

    console.log(command);
    cartItem.price = command.cartItem.price
      ? command.cartItem.price
      : cartItem.item.price * cartItem.quantity;

    try {
      await this.cartItemRepository.save(cartItem);
      return { cartId: command.cartId, cartItem };
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }
}
