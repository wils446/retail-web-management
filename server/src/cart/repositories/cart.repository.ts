import { NotFoundException, Provider } from '@nestjs/common';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';

import { Cart } from 'cart/entities';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';

export interface CartRepository extends Repository<Cart> {
  findOneByOrThrow: (
    this: CartRepository,
    options: FindOptionsWhere<Cart> | FindOptionsWhere<Cart>[],
  ) => Promise<Cart>;
}

export const customCardRepositoryMethods: Pick<
  CartRepository,
  'findOneByOrThrow'
> = {
  async findOneByOrThrow(options) {
    const cart = await this.findOneBy(options);
    if (!cart) throw new NotFoundException('cart is not found');
    return cart;
  },
};

export const CartRepository: Provider = {
  provide: getRepositoryToken(Cart),
  inject: [getDataSourceToken()],
  useFactory: (dataSource: DataSource) => {
    return dataSource.getRepository(Cart).extend(customCardRepositoryMethods);
  },
};
