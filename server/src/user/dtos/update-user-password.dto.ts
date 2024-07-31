import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserPasswordDto {
  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  oldPassword: string;
}
