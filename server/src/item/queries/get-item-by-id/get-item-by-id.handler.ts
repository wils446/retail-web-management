import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetItemByIdQuery } from './get-item-by-id.command';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'item/entities';
import { ItemRepository } from 'item/repositories';

@QueryHandler(GetItemByIdQuery)
export class GetItemByIdHandler implements IQueryHandler<GetItemByIdQuery> {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: ItemRepository,
  ) {}

  async execute(query: GetItemByIdQuery) {
    const item = await this.itemRepository.findOneOrThrow({
      where: { id: query.itemId },
      relations: { category: true, stocks: true },
    });

    return item;
  }
}
