import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { GetCartsQuery } from './get-carts.query';
import { Cart } from 'cart/entities';
import { CartRepository } from 'cart/repositories';

@QueryHandler(GetCartsQuery)
export class GetCartsHandler implements IQueryHandler<GetCartsQuery> {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: CartRepository,
  ) {}

  async execute(): Promise<{ counts: number; carts: Cart[] }> {
    try {
      const [carts, counts] = await this.cartRepository.findAndCount({
        relations: { cartItems: true },
      });
      return { counts, carts };
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }
}
