import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class ReturnItemDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  returnPrice: number;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  itemId: string;

  @IsBoolean()
  @IsOptional()
  isSellable: boolean;
}
