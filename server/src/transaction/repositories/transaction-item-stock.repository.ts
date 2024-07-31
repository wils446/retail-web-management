import { NotFoundException, Provider } from '@nestjs/common';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { TransactionItemStock } from 'transaction/entities';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';

export interface TransactionItemStockRepository
  extends Repository<TransactionItemStock> {
  findOneByOrThrow: (
    this: TransactionItemStockRepository,
    options:
      | FindOptionsWhere<TransactionItemStock>
      | FindOptionsWhere<TransactionItemStock>[],
  ) => Promise<TransactionItemStock>;
}

export const customTransactionItemStockRepositoryMethods: Pick<
  TransactionItemStockRepository,
  'findOneByOrThrow'
> = {
  async findOneByOrThrow(options) {
    const transactionItemStock = await this.findOneBy(options);
    if (!transactionItemStock)
      throw new NotFoundException('transaction item stock is not found');
    return transactionItemStock;
  },
};

export const TransactionItemStockRepository: Provider = {
  provide: getRepositoryToken(TransactionItemStock),
  inject: [getDataSourceToken()],
  useFactory: (dataSource: DataSource) =>
    dataSource
      .getRepository(TransactionItemStock)
      .extend(customTransactionItemStockRepositoryMethods),
};
