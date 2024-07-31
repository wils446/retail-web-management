import { IsNotEmpty, IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class OrderItemDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  itemId: string;

  @IsNotEmpty()
  @IsNumber()
  cost: number;
}
