import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { LoginCommand } from 'auth/commands';
import { LoginDto } from 'auth/dtos/login.dto';
import { CreateUserCommand } from 'user/commands';
import { CreateUserDto } from 'user/dtos/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('/login')
  async login(@Body() bodyPayload: LoginDto) {
    return await this.commandBus.execute(new LoginCommand(bodyPayload));
  }

  @Post('/register')
  async register(@Body() bodyPayload: CreateUserDto) {
    return await this.commandBus.execute(new CreateUserCommand(bodyPayload));
  }
}
