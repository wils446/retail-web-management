import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUserCommand } from './create-user.command';
import { User } from 'user/entities';
import { UserRepository } from 'user/repositories';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @InjectRepository(User) private readonly userRepository: UserRepository,
  ) {}

  async execute({ createUserData }: CreateUserCommand): Promise<any> {
    let user = await this.userRepository.findOneBy({
      username: createUserData.username,
    });

    if (user)
      throw new ConflictException(
        `user with username ${user.username} is already exist`,
      );

    user = await this.userRepository.create({
      username: createUserData.username,
      password: createUserData.password,
    });

    try {
      await this.userRepository.save(user);
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }
}
