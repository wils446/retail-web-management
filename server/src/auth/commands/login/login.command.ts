import { LoginDto } from 'auth/dtos/login.dto';

export class LoginCommand {
  constructor(public readonly userData: LoginDto) {}
}
