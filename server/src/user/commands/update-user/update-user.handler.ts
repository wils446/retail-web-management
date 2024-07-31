import {
  InternalServerErrorException,
  MethodNotAllowedException,
  UnauthorizedException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

import { User } from 'user/entities';
import { UserRepository } from 'user/repositories';
import { UpdateUserCommand } from './update-user.command';

type ExecuteReturnType = { id: string; username: string; role: string };

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    @InjectRepository(User) private readonly userRepository: UserRepository,
  ) {}

  async execute({
    updateUserData,
    authUser,
    userId,
  }: UpdateUserCommand): Promise<ExecuteReturnType> {
    if (authUser.role !== 'admin')
      throw new MethodNotAllowedException(
        "you're not allowed to update this user",
      );

    const admin = await this.userRepository.findOneByOrThrow({
      id: authUser.id,
    });

    const isPasswordMatch = await bcrypt.compare(
      updateUserData.adminPassword,
      admin.password,
    );

    if (!isPasswordMatch) throw new UnauthorizedException('password is wrong');

    const user = await this.userRepository.findOneByOrThrow({
      id: userId,
    });

    if (user.role === 'admin')
      throw new MethodNotAllowedException(
        "you're not allowed to update this user",
      );

    if (updateUserData.username) user.username = updateUserData.username;
    if (updateUserData.password) user.password = updateUserData.password;

    try {
      await this.userRepository.save(user);
      return { id: user.id, username: user.username, role: user.role };
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }
}
