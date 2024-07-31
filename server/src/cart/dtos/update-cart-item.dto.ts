import { IsNumber, IsOptional } from 'class-validator';

export class UpdateCartItemDto {
  @IsOptional()
  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsNumber()
  price: number;
}
