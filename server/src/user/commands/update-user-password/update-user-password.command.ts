import { UpdateUserDto } from 'user/dtos';
import { UpdateUserPasswordDto } from 'user/dtos/update-user-password.dto';
import { User } from 'user/entities';

export class UpdateUserPasswordCommand {
  constructor(
    public readonly user: User,
    public readonly updateUser: UpdateUserPasswordDto,
  ) {}
}
