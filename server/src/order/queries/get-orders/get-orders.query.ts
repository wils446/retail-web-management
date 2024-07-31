import { GetOrdersQueryDto } from 'order/dtos';

export class GetOrdersQuery {
  constructor(public readonly query: GetOrdersQueryDto) {}
}
