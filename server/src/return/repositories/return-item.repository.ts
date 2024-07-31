import { Provider } from '@nestjs/common';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { ReturnItem } from 'return/entities';
import { DataSource, Repository } from 'typeorm';

export interface ReturnItemRepository extends Repository<ReturnItem> {}

export const customReturnItemRepositoryMethods = {};

export const ReturnItemRepository: Provider = {
  provide: getRepositoryToken(ReturnItem),
  inject: [getDataSourceToken()],
  useFactory: (dataSource: DataSource) =>
    dataSource
      .getRepository(ReturnItem)
      .extend(customReturnItemRepositoryMethods),
};
