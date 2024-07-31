import { InternalServerErrorException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import {
  calculateDayStartAndEnd,
  LessThanOrEqualDate,
  MoreThanOrEqualDate,
} from 'commons/libs/utils';
import { Transaction } from 'transaction/entities/transaction.entity';
import { TransactionRepository } from 'transaction/repositories';
import { Between, FindOptionsWhere, Raw } from 'typeorm';
import { GetTransactionsQuery } from './get-transactions.query';

type ExecuteReturnType = {
  transactions: Transaction[];
  count: number;
};

@QueryHandler(GetTransactionsQuery)
export class GetTransactionshandler
  implements IQueryHandler<GetTransactionsQuery>
{
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async execute({ query }: GetTransactionsQuery): Promise<ExecuteReturnType> {
    const page = +query.page - 1 || 0;
    const length = +query.length || 20;

    const where: FindOptionsWhere<Transaction> = {};

    if (query.name)
      where.name = Raw(
        (alias) => `LOWER(${alias}) Like '%${query.name.toLowerCase()}%'`,
      );
    if (query.paid) where.paid = query.paid === 'true';
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
      const [transactions, count] =
        await this.transactionRepository.findAndCount({
          relations: {
            checkoutUser: true,
            items: { item: true },
            address: true,
          },
          take: length,
          skip: page * length,
          where,
          order: {
            [query.sortField]: query.sortType,
            created_at: 'desc',
          },
        });
      return { transactions, count };
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }
}
