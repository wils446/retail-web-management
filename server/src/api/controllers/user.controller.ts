import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetUser } from 'api/decorators';
import { JwtAuthGuard } from 'api/guards';
import { DeleteUserCommand, UpdateUserCommand } from 'user/commands';
import { DeleteUserDto, UpdateUserDto } from 'user/dtos';
import { User } from 'user/entities';
import { GetUsersQuery } from 'user/queries';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getUsers(@GetUser() user: User) {
    return await this.queryBus.execute(new GetUsersQuery(user));
  }

  @Patch('/:id')
  async updateUser(
    @GetUser() user: User,
    @Body() bodyPayload: UpdateUserDto,
    @Param('id') userId: string,
  ) {
    return await this.commandBus.execute(
      new UpdateUserCommand(user, bodyPayload, userId),
    );
  }

  @Delete('/:id')
  async deleteUser(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() bodyPayload: DeleteUserDto,
  ) {
    return await this.commandBus.execute(
      new DeleteUserCommand(user, id, bodyPayload),
    );
  }
}
