import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCartDto {
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @IsOptional()
  @IsString()
  itemId: string;
}
