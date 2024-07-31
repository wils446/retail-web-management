import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { Base } from 'commons/entities';
import { Item } from 'item/entities';
import { Cart } from './cart.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class CartItem extends Base {
  @Column()
  name: string;

  @Column()
  quantity: number;

  @Column()
  price: number;

  @Exclude()
  @Column({ type: 'uuid' })
  cartId: string;

  @Exclude()
  @Column({ type: 'uuid' })
  itemId: string;

  @ManyToOne(() => Cart, (cart) => cart.cartItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cartId' })
  cart: Cart;

  @ManyToOne(() => Item, { eager: true, nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'itemId' })
  item: Item;
}
