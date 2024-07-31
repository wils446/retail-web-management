export * from './create-user';
export * from './update-user';
export * from './delete-user';
export * from './verify-password';
export * from './update-user-password';

import { CreateUserHandler } from './create-user';
import { UpdateUserHandler } from './update-user';
import { DeleteUserHandler } from './delete-user';
import { VerifyPasswordHandler } from './verify-password';
import { UpdateUserPasswordHandler } from './update-user-password';
import { Provider } from '@nestjs/common';

export const CommandHandlers: Provider[] = [
  CreateUserHandler,
  UpdateUserHandler,
  DeleteUserHandler,
  VerifyPasswordHandler,
  UpdateUserPasswordHandler,
];
