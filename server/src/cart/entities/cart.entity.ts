import { Column, Entity, OneToMany } from 'typeorm';

import { Base } from 'commons/entities';
import { CartItem } from './cart-item.entity';

@Entity()
export class Cart extends Base {
  @Column({ default: '' })
  name: string;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  cartItems: CartItem[];

  @Column({ default: 0 })
  discount: number;
}
