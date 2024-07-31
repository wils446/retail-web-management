import { Provider } from '@nestjs/common';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { TransactionAddress } from 'transaction/entities';
import { DataSource, Repository } from 'typeorm';

export interface TransactionAddressRepository
  extends Repository<TransactionAddress> {}

export const customTransactionAddressRepositoryMethods = {};

export const TransactionAddressRepository: Provider = {
  provide: getRepositoryToken(TransactionAddress),
  inject: [getDataSourceToken()],
  useFactory: (dataSource: DataSource) =>
    dataSource
      .getRepository(TransactionAddress)
      .extend(customTransactionAddressRepositoryMethods),
};
