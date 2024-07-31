import { Provider } from '@nestjs/common';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { History } from 'history/entities';

export interface HistoryRepository extends Repository<History> {}

export const customHistoryRepositoryMethods = {};

export const HistoryRepository: Provider = {
  provide: getRepositoryToken(History),
  inject: [getDataSourceToken()],
  useFactory: (dataSource: DataSource) => {
    return dataSource
      .getRepository(History)
      .extend(customHistoryRepositoryMethods);
  },
};
