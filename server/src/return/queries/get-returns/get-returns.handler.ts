import { InternalServerErrorException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, Raw } from 'typeorm';

import {
  calculateDayStartAndEnd,
  LessThanOrEqualDate,
  MoreThanOrEqualDate,
} from 'commons/libs/utils';
import { Return } from 'return/entities';
import { ReturnRepository } from 'return/repositories';
import { GetReturnsQuery } from './get-returns.query';

type ExecuteReturnType = {
  returns: Return[];
  count: number;
};

@QueryHandler(GetReturnsQuery)
export class GetReturnsHandler implements IQueryHandler<GetReturnsQuery> {
  constructor(
    @InjectRepository(Return)
    private readonly returnRepository: ReturnRepository,
  ) {}

  async execute({ query }: GetReturnsQuery): Promise<ExecuteReturnType> {
    const page = +query.page - 1 || 0;
    const length = +query.length || 20;

    const where: FindOptionsWhere<Return> = {};

    if (query.name)
      where.name = Raw(
        (alias) => `LOWER(${alias}) Like '%${query.name.toLowerCase()}%'`,
      );
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
    } else if (query.date) {
      const { dateEnd, dateStart } = calculateDayStartAndEnd(query.date);
      where.created_at = Between(dateStart, dateEnd);
    }

    try {
      const [returns, count] = await this.returnRepository.findAndCount({
        relations: { returnItem: true },
        where,
        take: length,
        skip: page * length,
        order: {
          [query.sortField]: query.sortType,
          created_at: 'desc',
        },
      });
      return { returns, count };
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }
}
