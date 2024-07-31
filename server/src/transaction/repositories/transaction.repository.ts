import { NotFoundException, Provider } from '@nestjs/common';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import {
  DataSource,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { Transaction } from 'transaction/entities/transaction.entity';

export interface TransactionRepository extends Repository<Transaction> {
  findOneByOrThrow: (
    this: TransactionRepository,
    options: FindOptionsWhere<Transaction> | FindOptionsWhere<Transaction>[],
  ) => Promise<Transaction>;
  findOneOrThrow: (
    this: TransactionRepository,
    options: FindOneOptions<Transaction>,
  ) => Promise<Transaction>;
}

export const customTransactionRepositoryMethods: Pick<
  TransactionRepository,
  'findOneByOrThrow' | 'findOneOrThrow'
> = {
  async findOneByOrThrow(options) {
    const transaction = await this.findOneBy(options);
    if (!transaction) throw new NotFoundException('transaction is not found');
    return transaction;
  },
  async findOneOrThrow(options) {
    const transaction = await this.findOne(options);
    if (!transaction) throw new NotFoundException('transaction is not found');
    return transaction;
  },
};

export const TransactionRepository: Provider = {
  provide: getRepositoryToken(Transaction),
  inject: [getDataSourceToken()],
  useFactory: (dataSource: DataSource) => {
    return dataSource
      .getRepository(Transaction)
      .extend(customTransactionRepositoryMethods);
  },
};
