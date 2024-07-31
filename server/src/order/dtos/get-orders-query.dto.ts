import { IsBooleanString, IsEnum, IsOptional, IsString } from 'class-validator';
import { GetQueryDto } from 'commons/dtos';

type OrderField = 'name' | 'invoiceNumber' | 'paid';
const orderField: OrderField[] = ['invoiceNumber', 'name', 'paid'];

export class GetOrdersQueryDto extends GetQueryDto {
  @IsString()
  @IsOptional()
  @IsEnum(orderField)
  sortField: OrderField;

  @IsString()
  @IsOptional()
  name: string;

  @IsBooleanString()
  @IsOptional()
  paid: string;
}
