import { InternalServerErrorException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { History } from 'history/entities';
import { HistoryRepository } from 'history/repositories';
import { GetHistoriesQuery } from './get-histories.query';
import { Between, FindOptionsWhere } from 'typeorm';
import { LessThanOrEqualDate, MoreThanOrEqualDate } from 'commons/libs/utils';

@QueryHandler(GetHistoriesQuery)
export class GetHistoriesHandler implements IQueryHandler<GetHistoriesQuery> {
  constructor(
    @InjectRepository(History)
    private readonly historyRepository: HistoryRepository,
  ) {}

  async execute({
    query,
  }: GetHistoriesQuery): Promise<{ histories: History[]; count: number }> {
    const page = +query.page - 1 || 0;
    const length = +query.length || 20;

    const where: FindOptionsWhere<History> = {};

    if (query.type) where.type = query.type;
    if (query.startDate) {
      if (query.endDate) {
        where.created_at = Between(
          new Date(query.startDate),
          new Date(query.endDate),
        );
      } else {
        where.created_at = MoreThanOrEqualDate(query.startDate);
      }
    } else if (query.endDate) {
      where.created_at = LessThanOrEqualDate(query.endDate);
    }

    try {
      const [histories, count] = await this.historyRepository.findAndCount({
        where,
        skip: page * length,
        take: length,
        order: {
          [query.sortField]: query.sortType,
          created_at: 'desc',
        },
      });
      return { histories, count };
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }
}
