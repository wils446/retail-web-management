import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { GetUser } from 'api/decorators';
import { JwtAuthGuard } from 'api/guards';
import { CreateHistoryCommand } from 'history/commands';
import { CreateHistoryDto, GetHistoriesQueryDto } from 'history/dtos';
import { GetHistoriesQuery } from 'history/queries';
import { User } from 'user/entities';

@Controller('history')
@UseGuards(JwtAuthGuard)
export class HistoryController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getHistories(
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    queries: GetHistoriesQueryDto,
  ) {
    return await this.queryBus.execute(new GetHistoriesQuery(queries));
  }

  @Post()
  async createHistory(
    @GetUser() user: User,
    @Body() bodyPayload: CreateHistoryDto,
  ) {
    return await this.commandBus.execute(
      new CreateHistoryCommand(user, bodyPayload),
    );
  }
}
