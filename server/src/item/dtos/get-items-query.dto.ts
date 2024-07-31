import { IsEnum, IsOptional, IsString } from 'class-validator';

import { GetQueryDto } from 'commons/dtos';
import { ItemField } from 'item/entities';

const itemField: ItemField[] = ['category', 'name', 'price'];

export class GetItemsQueryDto extends GetQueryDto {
  @IsString()
  @IsOptional()
  @IsEnum(itemField)
  sortField: ItemField;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  category: string;
}
