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
  CreateCategoryCommand,
  DeleteCategoryCommand,
  UpdateCategoryCommand,
} from 'category/commands';
import { CreateCategoryDto, UpdateCategoryDto } from 'category/dtos';
import { GetCategoriesQuery, GetCategoryItemsQuery } from 'category/queries';
import { User } from 'user/entities';

@Controller('category')
@UseGuards(JwtAuthGuard)
export class CategoryController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getCategories() {
    return await this.queryBus.execute(new GetCategoriesQuery());
  }

  @Get('/:id/items')
  async getCategoryItems(@Param('id') categoryId: string) {
    return await this.queryBus.execute(new GetCategoryItemsQuery(categoryId));
  }

  @Post()
  async createCategory(
    @GetUser() user: User,
    @Body() bodyPayload: CreateCategoryDto,
  ) {
    return await this.commandBus.execute(
      new CreateCategoryCommand(bodyPayload, user),
    );
  }

  @Delete('/:id')
  async deleteCategory(@GetUser() user: User, @Param('id') categoryId: string) {
    return await this.commandBus.execute(
      new DeleteCategoryCommand(categoryId, user),
    );
  }

  @Patch('/:id')
  async updateCategory(
    @GetUser() user: User,
    @Param('id') categoryId: string,
    @Body() bodyPayload: UpdateCategoryDto,
  ) {
    return await this.commandBus.execute(
      new UpdateCategoryCommand(categoryId, bodyPayload, user),
    );
  }
}
