import { GetItemsQueryDto } from 'item/dtos/get-items-query.dto';

export class GetItemsQuery {
  constructor(public readonly query: GetItemsQueryDto) {}
}
