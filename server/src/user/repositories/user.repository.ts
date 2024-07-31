import { NotFoundException, Provider } from '@nestjs/common';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';

import { User } from 'user/entities';

export interface UserRepository extends Repository<User> {
  findOneByOrThrow: (
    this: UserRepository,
    options: FindOptionsWhere<User> | FindOptionsWhere<User>[],
  ) => Promise<User>;
}

export const customUserRepositoryMethods: Pick<
  UserRepository,
  'findOneByOrThrow'
> = {
  async findOneByOrThrow(options) {
    const user = await this.findOneBy(options);
    if (!user) throw new NotFoundException('user is not found');
    return user;
  },
};

export const UserRepository: Provider = {
  provide: getRepositoryToken(User),
  inject: [getDataSourceToken()],
  useFactory: (dataSource: DataSource) => {
    return dataSource.getRepository(User).extend(customUserRepositoryMethods);
  },
};
