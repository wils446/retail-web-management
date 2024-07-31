import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { GetUser } from 'api/decorators';
import { JwtAuthGuard } from 'api/guards';
import { UpdateUserPasswordCommand } from 'user/commands';
import { UpdateUserPasswordDto } from 'user/dtos/update-user-password.dto';
import { User } from 'user/entities';

@Controller('me')
@UseGuards(JwtAuthGuard)
export class MeController {
  constructor(private readonly commandBus: CommandBus) {}

  @Get()
  async getMe(@GetUser() user: User) {
    return user;
  }

  @Patch()
  async updateMePassword(
    @GetUser() user: User,
    @Body() bodyPayload: UpdateUserPasswordDto,
  ) {
    return await this.commandBus.execute(
      new UpdateUserPasswordCommand(user, bodyPayload),
    );
  }
}
