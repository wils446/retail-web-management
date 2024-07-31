import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

import { UpdateUserPasswordCommand } from './update-user-password.command';
import { User } from 'user/entities';
import { UserRepository } from 'user/repositories';
import {
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

@CommandHandler(UpdateUserPasswordCommand)
export class UpdateUserPasswordHandler
  implements ICommandHandler<UpdateUserPasswordCommand>
{
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: UpdateUserPasswordCommand): Promise<any> {
    let user: User;

    if (command.updateUser.id)
      user = await this.userRepository.findOneByOrThrow({
        id: command.updateUser.id,
      });
    else
      user = await this.userRepository.findOneByOrThrow({
        id: command.user.id,
      });

    const isMatch = await bcrypt.compare(
      command.updateUser.oldPassword,
      user.password,
    );

    if (!isMatch) throw new UnauthorizedException('password is wrong');

    user.password = command.updateUser.newPassword;

    try {
      await this.userRepository.save(user);
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }
}
