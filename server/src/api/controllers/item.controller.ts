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
  CreateItemCommand,
  DeleteItemCommand,
  UpdateItemCommand,
} from 'item/commands';
import { CreateItemDto, GetItemsQueryDto, UpdateItemDto } from 'item/dtos';
import { GetItemByIdQuery, GetItemsQuery } from 'item/queries';
import { User } from 'user/entities';

@Controller('item')
@UseGuards(JwtAuthGuard)
export class ItemController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getItems(
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    queries: GetItemsQueryDto,
  ) {
    return await this.queryBus.execute(new GetItemsQuery(queries));
  }

  @Get(':id')
  async getItemById(@Param('id') userId: string) {
    return await this.queryBus.execute(new GetItemByIdQuery(userId));
  }

  @Post()
  async createItem(@GetUser() user: User, @Body() bodyPayload: CreateItemDto) {
    return await this.commandBus.execute(
      new CreateItemCommand(bodyPayload, user),
    );
  }

  @Delete('/:id')
  async deleteItem(@GetUser() user: User, @Param('id') itemId: string) {
    return await this.commandBus.execute(new DeleteItemCommand(itemId, user));
  }

  @Patch('/:id')
  async updateItem(
    @Param('id') itemId: string,
    @Body() bodyPayload: UpdateItemDto,
    @GetUser() user: User,
  ) {
    return await this.commandBus.execute(
      new UpdateItemCommand(itemId, bodyPayload, user),
    );
  }
}
