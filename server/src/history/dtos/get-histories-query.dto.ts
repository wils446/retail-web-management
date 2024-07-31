import { IsEnum, IsOptional, IsString } from 'class-validator';

import { GetQueryDto } from 'commons/dtos';
import { HistoryType } from 'history/entities';

type HistoryField = 'text' | 'type' | 'delete';
const historyField: HistoryField[] = ['delete', 'text', 'type'];
const historyType: HistoryType[] = ['create', 'delete', 'update'];

export class GetHistoriesQueryDto extends GetQueryDto {
  @IsOptional()
  @IsString()
  @IsEnum(historyField)
  sortField: HistoryField;

  @IsOptional()
  @IsString()
  @IsEnum(historyType)
  type: HistoryType;
}
