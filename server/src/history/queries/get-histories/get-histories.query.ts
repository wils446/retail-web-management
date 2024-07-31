import { GetHistoriesQueryDto } from 'history/dtos';

export class GetHistoriesQuery {
  constructor(public readonly query: GetHistoriesQueryDto) {}
}
