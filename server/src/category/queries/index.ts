export * from './get-categories';
export * from './get-category-items';

import { Provider } from '@nestjs/common';

import { GetCategoriesHandler } from './get-categories';
import { GetCategoryItemsHandler } from './get-category-items';

export const QueryHandlers: Provider[] = [
  GetCategoriesHandler,
  GetCategoryItemsHandler,
];
