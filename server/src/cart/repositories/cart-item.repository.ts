import { NotFoundException, Provider } from '@nestjs/common';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { CartItem } from 'cart/entities';
import {
  DataSource,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

export interface CartItemRepository extends Repository<CartItem> {
  findOneByOrThrow: (
    this: CartItemRepository,
    options: FindOptionsWhere<CartItem> | FindOptionsWhere<CartItem>[],
  ) => Promise<CartItem>;
  findOneOrThrow: (
    this: CartItemRepository,
    options: FindOneOptions<CartItem>,
  ) => Promise<CartItem>;
}

export const customCartItemRepositoryMethods: Pick<
  CartItemRepository,
  'findOneByOrThrow' | 'findOneOrThrow'
> = {
  async findOneByOrThrow(options) {
    const cartItem = await this.findOneBy(options);
    if (!cartItem) throw new NotFoundException('cart item is not found');
    return cartItem;
  },
  async findOneOrThrow(options) {
    const cartItem = await this.findOne(options);
    if (!cartItem) throw new NotFoundException('cart item is not found');
    return cartItem;
  },
};

export const CartItemRepository: Provider = {
  provide: getRepositoryToken(CartItem),
  inject: [getDataSourceToken()],
  useFactory: (dataSource: DataSource) => {
    return dataSource
      .getRepository(CartItem)
      .extend(customCartItemRepositoryMethods);
  },
};
