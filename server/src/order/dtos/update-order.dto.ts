import { IsBoolean, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class UpdateOrderDto {
  @IsOptional()
  @IsBoolean()
  paid: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(2)
  status: number;
}
