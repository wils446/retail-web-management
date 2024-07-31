import { UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

import { User } from 'user/entities';
import { UserRepository } from 'user/repositories';
import { LoginCommand } from './login.command';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    @InjectRepository(User) private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute({ userData }: LoginCommand): Promise<any> {
    const user = await this.userRepository.findOneByOrThrow({
      username: userData.username,
    });

    const isMatch = await bcrypt.compare(userData.password, user.password);

    if (!isMatch) throw new UnauthorizedException('your password is wrong');

    const access_token = await this.jwtService.signAsync({ sub: user.id });

    return { access_token };
  }
}
