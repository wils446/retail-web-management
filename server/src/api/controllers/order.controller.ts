import {
  Body,
  Controller,
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
import { CreateOrderCommand, UpdateOrderCommand } from 'order/commands';
import { CreateOrderDto, GetOrdersQueryDto, UpdateOrderDto } from 'order/dtos';
import { GetOrderByIdQuery, GetOrdersQuery } from 'order/queries';
import { User } from 'user/entities';

@Controller('order')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getOrders(
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    queries: GetOrdersQueryDto,
  ) {
    return await this.queryBus.execute(new GetOrdersQuery(queries));
  }

  @Get(':id')
  async getOrderById(@Param('id') orderId: string) {
    return await this.queryBus.execute(new GetOrderByIdQuery(orderId));
  }

  @Post()
  async createOrder(
    @GetUser() user: User,
    @Body() bodyPayload: CreateOrderDto,
  ) {
    return await this.commandBus.execute(
      new CreateOrderCommand(bodyPayload, user),
    );
  }

  @Patch('/:id')
  async updateOrder(
    @GetUser() user: User,
    @Param('id') orderId: string,
    @Body() bodyPayload: UpdateOrderDto,
  ) {
    return await this.commandBus.execute(
      new UpdateOrderCommand(orderId, bodyPayload, user),
    );
  }
}
