import { DeleteUserDto } from 'user/dtos';
import { User } from 'user/entities';

export class DeleteUserCommand {
  constructor(
    public readonly authUser: User,
    public readonly deleteUserId: string,
    public readonly deleteUserData: DeleteUserDto,
  ) {}
}
