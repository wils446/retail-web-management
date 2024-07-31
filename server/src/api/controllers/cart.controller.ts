import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetUser } from 'api/decorators';

import { JwtAuthGuard } from 'api/guards';
import {
  AddCartItemCommand,
  CreateCartCommand,
  DeleteCartCommand,
  DeleteCartItemCommand,
  UpdateCartCommand,
  UpdateCartItemCommand,
} from 'cart/commands';
import { AddCartItemDto, CreateCartDto, UpdateCartItemDto } from 'cart/dtos';
import { UpdateCartDto } from 'cart/dtos/update-cart.dto';
import { GetCartsQuery } from 'cart/queries';
import { User } from 'user/entities';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getCarts() {
    return await this.queryBus.execute(new GetCartsQuery());
  }

  @Post()
  async createCart(@GetUser() user: User, @Body() bodyPayload: CreateCartDto) {
    return await this.commandBus.execute(
      new CreateCartCommand(bodyPayload, user),
    );
  }

  @Delete('/:id')
  async deleteCart(@GetUser() user: User, @Param('id') cartId: string) {
    return await this.commandBus.execute(new DeleteCartCommand(cartId, user));
  }

  @Patch('/:id')
  async updateCart(
    @GetUser() user: User,
    @Param('id') cartId: string,
    @Body() bodyPayload: UpdateCartDto,
  ) {
    return await this.commandBus.execute(
      new UpdateCartCommand(cartId, bodyPayload, user),
    );
  }

  @Post('/:id/cart-item')
  async addCartItem(
    @GetUser() user: User,
    @Param('id') cartId: string,
    @Body() bodyPayload: AddCartItemDto,
  ) {
    return await this.commandBus.execute(
      new AddCartItemCommand(cartId, bodyPayload, user),
    );
  }

  @Patch('/:id/cart-item/:itemId')
  async updateCartItem(
    @GetUser() user: User,
    @Param('id') cartId: string,
    @Param('itemId') cartItemId: string,
    @Body() bodyPayload: UpdateCartItemDto,
  ) {
    if (bodyPayload.quantity <= 0)
      return await this.commandBus.execute(
        new DeleteCartItemCommand(cartId, cartItemId, user),
      );
    return await this.commandBus.execute(
      new UpdateCartItemCommand(cartId, cartItemId, bodyPayload),
    );
  }

  @Delete('/:id/cart-item/:itemId')
  async deleteCartItem(
    @GetUser() user: User,
    @Param('id') cartId: string,
    @Param('itemId') cartItemId: string,
  ) {
    return await this.commandBus.execute(
      new DeleteCartItemCommand(cartId, cartItemId, user),
    );
  }
}
