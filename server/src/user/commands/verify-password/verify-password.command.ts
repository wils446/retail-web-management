import { VerifyPasswordDto } from 'user/dtos/verify-password.dto';
import { User } from 'user/entities';

export class VerifyPasswordCommand {
  constructor(
    public readonly user: User,
    public readonly verifyPassword: VerifyPasswordDto,
  ) {}
}
