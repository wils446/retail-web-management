import { NotFoundException, Provider } from '@nestjs/common';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import {
  DataSource,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { Return } from 'return/entities';

export interface ReturnRepository extends Repository<Return> {
  findOneByOrThrow: (
    this: ReturnRepository,
    options: FindOptionsWhere<Return> | FindOptionsWhere<Return>[],
  ) => Promise<Return>;
  findOneOrThrow: (
    this: ReturnRepository,
    options: FindOneOptions<Return>,
  ) => Promise<Return>;
}

export const customReturnRepositoryMethods: Pick<
  ReturnRepository,
  'findOneByOrThrow' | 'findOneOrThrow'
> = {
  async findOneByOrThrow(options) {
    const retur = await this.findOneBy(options);
    if (!retur) throw new NotFoundException('retur is not found');
    return retur;
  },
  async findOneOrThrow(options) {
    const retur = await this.findOne(options);
    if (!retur) throw new NotFoundException('retur is not found');
    return retur;
  },
};

export const ReturnRepository: Provider = {
  provide: getRepositoryToken(Return),
  inject: [getDataSourceToken()],
  useFactory: (dataSource: DataSource) =>
    dataSource.getRepository(Return).extend(customReturnRepositoryMethods),
};
