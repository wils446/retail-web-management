import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { GetUser } from 'api/decorators';
import { JwtAuthGuard } from 'api/guards';
import {
  CreateTransactionCommand,
  DeleteTransactionCommand,
  UpdateTransactionCommand,
} from 'transaction/commands';
import {
  CreateTransactionDto,
  GetTransactionsQueryDto,
  UpdateTransactionDto,
} from 'transaction/dtos';
import {
  GetTransactionByIdQuery,
  GetTransactionsQuery,
} from 'transaction/queries';
import { User } from 'user/entities';

@Controller('transaction')
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getTransactions(
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    queries: GetTransactionsQueryDto,
  ) {
    return await this.queryBus.execute(new GetTransactionsQuery(queries));
  }

  @Get(':id')
  async getTransactionById(@Param('id') transactionId: string) {
    return await this.queryBus.execute(
      new GetTransactionByIdQuery(transactionId),
    );
  }

  @Post()
  async createTransaction(
    @GetUser() user: User,
    @Body() bodyPayload: CreateTransactionDto,
  ) {
    return await this.commandBus.execute(
      new CreateTransactionCommand(user, bodyPayload),
    );
  }

  @Patch('/:id')
  async updateTransaction(
    @GetUser() user: User,
    @Param('id') transactionId: string,
    @Body() bodyPayload: UpdateTransactionDto,
  ) {
    return await this.commandBus.execute(
      new UpdateTransactionCommand(transactionId, bodyPayload, user),
    );
  }

  @Delete('/:id')
  async deleteTransaction(
    @GetUser() user: User,
    @Param('id') transactionId: string,
  ) {
    return await this.commandBus.execute(
      new DeleteTransactionCommand(transactionId, user),
    );
  }
}
