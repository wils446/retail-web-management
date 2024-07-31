import { IsBoolean, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class UpdateTransactionDto {
  @IsBoolean()
  @IsOptional()
  paid: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(2)
  status: number;
}
