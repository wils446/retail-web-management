import { UpdateUserDto } from 'user/dtos';
import { User } from 'user/entities';

export class UpdateUserCommand {
  constructor(
    public readonly authUser: User,
    public readonly updateUserData: UpdateUserDto,
    public readonly userId: string,
  ) {}
}
