import { IsEnum, IsOptional, IsString } from 'class-validator';

import { GetQueryDto } from 'commons/dtos';
import { ReturnType } from 'return/entities';

type ReturnField = 'name' | 'type' | 'invoiceNumber';
const returnField: ReturnField[] = ['invoiceNumber', 'name', 'type'];
const returnType: ReturnType[] = ['order', 'transaction'];

export class GetReturnsQueryDto extends GetQueryDto {
  @IsOptional()
  @IsString()
  @IsEnum(returnField)
  sortField: ReturnField;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  @IsEnum(returnType)
  type: ReturnType;
}
