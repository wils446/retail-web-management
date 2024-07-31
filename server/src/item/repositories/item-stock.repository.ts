import {
  InternalServerErrorException,
  NotFoundException,
  Provider,
} from '@nestjs/common';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';

import { ItemStock } from 'item/entities';

export interface ItemStockRepository extends Repository<ItemStock> {
  findOneByOrThrow: (
    this: ItemStockRepository,
    options: FindOptionsWhere<ItemStock> | FindOptionsWhere<ItemStock>[],
  ) => Promise<ItemStock>;
  deleteItemStock: (this: ItemStockRepository, id: string) => Promise<void>;
  decreaseItemStock: (
    this: ItemStockRepository,
    id: string,
    count: number,
  ) => Promise<ItemStock>;
}

export const customItemStockRepositoryMethods: Pick<
  ItemStockRepository,
  'deleteItemStock' | 'decreaseItemStock' | 'findOneByOrThrow'
> = {
  async deleteItemStock(id) {
    const result = await this.delete({ id });
    if (result.affected === 0)
      throw new NotFoundException('item stock is not found');
  },
  async decreaseItemStock(id, count) {
    const itemStock = await this.findOneByOrThrow({ id });

    itemStock.stock -= count;

    try {
      await this.save(itemStock);
      return itemStock;
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  },
  async findOneByOrThrow(options) {
    const itemStock = await this.findOneBy(options);
    if (!itemStock) throw new NotFoundException('item stock is not found');
    return itemStock;
  },
};

export const ItemStockRepository: Provider = {
  provide: getRepositoryToken(ItemStock),
  inject: [getDataSourceToken()],
  useFactory: (dataSource: DataSource) =>
    dataSource
      .getRepository(ItemStock)
      .extend(customItemStockRepositoryMethods),
};
