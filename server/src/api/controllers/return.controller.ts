import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { GetUser } from 'api/decorators';
import { JwtAuthGuard } from 'api/guards';
import { CreateReturnCommand } from 'return/commands/create-return';
import { CreateReturnDto, GetReturnsQueryDto } from 'return/dtos';
import { GetReturnByIdQuery, GetReturnsQuery } from 'return/queries';
import { User } from 'user/entities';

@Controller('/return')
@UseGuards(JwtAuthGuard)
export class ReturnController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getReturns(
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    queries: GetReturnsQueryDto,
  ) {
    return await this.queryBus.execute(new GetReturnsQuery(queries));
  }

  @Get(':id')
  async getReturnById(@Param('id') returnId: string) {
    return await this.queryBus.execute(new GetReturnByIdQuery(returnId));
  }

  @Post()
  async createReturn(
    @GetUser() user: User,
    @Body() bodyPayload: CreateReturnDto,
  ) {
    return await this.commandBus.execute(
      new CreateReturnCommand(bodyPayload, user),
    );
  }
}
