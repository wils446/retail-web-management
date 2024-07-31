import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ReturnItemDto } from './return-item.dto';

export class CreateReturnDto {
  @IsNotEmpty()
  @IsUUID()
  targetId: string;

  @IsNotEmpty()
  @IsString()
  type: 'order' | 'transaction';

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => ReturnItemDto)
  items: ReturnItemDto[];
}
