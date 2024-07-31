import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import {
  MethodNotAllowedException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

type ExecuteReturnType = {
  message: string;
};

import { DeleteUserCommand } from './delete-user.command';
import { UserRepository } from 'user/repositories';
import { User } from 'user/entities';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(
    @InjectRepository(User) private readonly userRepository: UserRepository,
  ) {}

  async execute({
    authUser,
    deleteUserId,
    deleteUserData,
  }: DeleteUserCommand): Promise<ExecuteReturnType> {
    if (authUser.role !== 'admin')
      throw new MethodNotAllowedException("you're not allowed");

    const admin = await this.userRepository.findOneByOrThrow({
      id: authUser.id,
    });

    const isPasswordMatch = await bcrypt.compare(
      deleteUserData.adminPassword,
      admin.password,
    );

    if (!isPasswordMatch) throw new UnauthorizedException('password is wrong');

    if (authUser.id == deleteUserId)
      throw new MethodNotAllowedException("you can't delete yourself");

    const result = await this.userRepository.delete({ id: deleteUserId });
    if (result.affected === 0) {
      throw new NotFoundException(`user with id ${deleteUserId} is not found`);
    }
    return { message: `${deleteUserId} deleted` };
  }
}
