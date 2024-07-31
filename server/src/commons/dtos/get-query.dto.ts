import {
  IsDateString,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export type SortType = 'asc' | 'desc';
export const sortType: SortType[] = ['asc', 'desc'];

export class GetQueryDto {
  @IsOptional()
  @IsNumberString()
  page: string;

  @IsOptional()
  @IsNumberString()
  length: string;

  @IsOptional()
  @IsString()
  @IsEnum(sortType)
  sortType: SortType;

  @IsOptional()
  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsDateString()
  date: string;
}
