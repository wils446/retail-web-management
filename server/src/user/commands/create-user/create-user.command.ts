import { CreateUserDto } from 'user/dtos/create-user.dto';

export class CreateUserCommand {
  constructor(public readonly createUserData: CreateUserDto) {}
}
