import { IsBooleanString, IsEnum, IsOptional, IsString } from 'class-validator';
import { GetQueryDto } from 'commons/dtos';

type TransactionField = 'name' | 'invoiceNumber' | 'paid';
const transactionField: TransactionField[] = ['invoiceNumber', 'name', 'paid'];

export class GetTransactionsQueryDto extends GetQueryDto {
  @IsOptional()
  @IsString()
  @IsEnum(transactionField)
  sortField: TransactionField;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsBooleanString()
  paid: string;
}
