import { NotFoundException, Provider } from '@nestjs/common';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import {
  DataSource,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { Item } from 'item/entities';

export interface ItemRepository extends Repository<Item> {
  findOneByOrThrow: (
    this: ItemRepository,
    options: FindOptionsWhere<Item> | FindOptionsWhere<Item>[],
  ) => Promise<Item>;
  findOneOrThrow: (
    this: ItemRepository,
    options: FindOneOptions<Item>,
  ) => Promise<Item>;
}

export const customItemRepositoryMethods: Pick<
  ItemRepository,
  'findOneByOrThrow' | 'findOneOrThrow'
> = {
  async findOneByOrThrow(options) {
    const item = await this.findOneBy(options);
    if (!item) throw new NotFoundException('item is not found');
    return item;
  },
  async findOneOrThrow(options) {
    const item = await this.findOne(options);
    if (!item) throw new NotFoundException('item is not found');
    return item;
  },
};

export const ItemRepository: Provider = {
  provide: getRepositoryToken(Item),
  inject: [getDataSourceToken()],
  useFactory: (dataSource: DataSource) => {
    return dataSource.getRepository(Item).extend(customItemRepositoryMethods);
  },
};
