import { CreateReturnDto } from 'return/dtos';
import { User } from 'user/entities';

export class CreateReturnCommand {
  constructor(
    public readonly returnData: CreateReturnDto,
    public readonly user: User,
  ) {}
}
