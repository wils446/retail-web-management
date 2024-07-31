import {
  InternalServerErrorException,
  MethodNotAllowedException,
} from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'user/entities';
import { UserRepository } from 'user/repositories';
import { GetUsersQuery } from './get-users.query';

type ExecuteReturnType = {
  counts: number;
  users: User[];
};

@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
  constructor(
    @InjectRepository(User) private readonly userRepository: UserRepository,
  ) {}

  async execute({ authUser }: GetUsersQuery): Promise<ExecuteReturnType> {
    if (authUser.role !== 'admin')
      throw new MethodNotAllowedException("you're not allowed");

    try {
      const [users, counts] = await this.userRepository.findAndCount({
        select: ['id', 'username', 'role'],
      });
      return { counts, users };
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }
}
