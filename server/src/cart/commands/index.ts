export * from './create-cart';
export * from './delete-cart';
export * from './update-cart';
export * from './add-cart-item';
export * from './update-cart-item';
export * from './delete-cart-item';

import { Provider } from '@nestjs/common';

import { CreateCartHandler } from './create-cart';
import { DeleteCartHandler } from './delete-cart';
import { UpdateCartHandler } from './update-cart';
import { AddCartItemHandler } from './add-cart-item';
import { UpdateCartItemHandler } from './update-cart-item';
import { DeleteCartItemHandler } from './delete-cart-item';

export const CommandHandlers: Provider[] = [
  CreateCartHandler,
  DeleteCartHandler,
  UpdateCartHandler,
  AddCartItemHandler,
  UpdateCartItemHandler,
  DeleteCartItemHandler,
];
