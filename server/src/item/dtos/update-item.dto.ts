import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateItemDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  categoryId: string;
}
