import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'user/entities';
import { UserRepository } from 'user/repositories';
import { VerifyPasswordCommand } from './verify-password.command';

@CommandHandler(VerifyPasswordCommand)
export class VerifyPasswordHandler
  implements ICommandHandler<VerifyPasswordCommand>
{
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: VerifyPasswordCommand): Promise<any> {
    try {
      const user = await this.userRepository.findOneByOrThrow({
        username: command.user.username,
      });

      const isMatch = await bcrypt.compare(
        command.verifyPassword.password,
        user.password,
      );

      return { isMatch };
    } catch (err) {
      throw err;
    }
  }
}
