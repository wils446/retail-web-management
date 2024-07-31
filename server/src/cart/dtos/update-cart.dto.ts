import { IsOptional, IsString } from 'class-validator';

export class UpdateCartDto {
  @IsOptional()
  @IsString()
  name: string;
}
