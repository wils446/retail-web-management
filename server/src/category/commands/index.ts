export * from './create-category';
export * from './delete-category';
export * from './update-category';

import { Provider } from '@nestjs/common';

import { CreateCategoryHandler } from './create-category';
import { DeleteCategoryHandler } from './delete-category';
import { UpdateCategoryHandler } from './update-category';

export const CommandHandlers: Provider[] = [
  CreateCategoryHandler,
  DeleteCategoryHandler,
  UpdateCategoryHandler,
];
