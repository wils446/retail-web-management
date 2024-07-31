import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class AddCartItemDto {
  @IsNotEmpty()
  @IsString()
  itemId: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsNumber()
  price: number;
}
