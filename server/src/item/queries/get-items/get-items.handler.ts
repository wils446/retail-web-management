import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Raw } from 'typeorm';

import { GetItemsQuery } from './get-items.query';
import { Item } from 'item/entities';
import { ItemRepository } from 'item/repositories';

@QueryHandler(GetItemsQuery)
export class GetItemsHandler implements IQueryHandler<GetItemsQuery> {
  constructor(
    @InjectRepository(Item) private readonly itemRepository: ItemRepository,
  ) {}

  async execute({
    query,
  }: GetItemsQuery): Promise<{ count: number; items: Item[] }> {
    const page = +query.page - 1 || 0;
    const length = +query.length || 20;

    const where: FindOptionsWhere<Item> = {};

    if (query.name)
      where.name = Raw(
        (alias) => `LOWER(${alias}) Like '%${query.name.toLowerCase()}%'`,
      );
    if (query.category)
      where.category = {
        name: Raw(
          (alias) => `LOWER(${alias}) Like '%${query.category.toLowerCase()}%'`,
        ),
      };

    try {
      const [items, count] = await this.itemRepository.findAndCount({
        where,
        relations: { category: true, stocks: true },
        skip: page * length,
        take: length,
        order: {
          [query.sortField]: query.sortType,
        },
      });

      return {
        count,
        items,
      };
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }
}
