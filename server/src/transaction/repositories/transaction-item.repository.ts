import { NotFoundException, Provider } from '@nestjs/common';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { TransactionItem } from 'transaction/entities';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';

export interface TransactionItemRepository extends Repository<TransactionItem> {
  findOneByOrThrow: (
    this: TransactionItemRepository,
    options:
      | FindOptionsWhere<TransactionItem>
      | FindOptionsWhere<TransactionItem>[],
  ) => Promise<TransactionItem>;
}

export const customTransactionItemRepositoryMethods: Pick<
  TransactionItemRepository,
  'findOneByOrThrow'
> = {
  async findOneByOrThrow(options) {
    const transactionItem = await this.findOneBy(options);
    if (!transactionItem)
      throw new NotFoundException('transaction item is not found');
    return transactionItem;
  },
};

export const TransactionItemRepository: Provider = {
  provide: getRepositoryToken(TransactionItem),
  inject: [getDataSourceToken()],
  useFactory: (dataSource: DataSource) =>
    dataSource
      .getRepository(TransactionItem)
      .extend(customTransactionItemRepositoryMethods),
};
