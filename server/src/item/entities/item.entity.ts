import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { Category } from 'category/entities';
import { Base } from 'commons/entities';
import { ItemStock } from './item-stock.entity';
import { CartItem } from 'cart/entities';
import { Exclude } from 'class-transformer';

export type ItemField = 'name' | 'price' | 'category';

@Entity()
export class Item extends Base {
  @Column()
  name: string;

  @Column({ default: 0 })
  price: number;

  @Exclude()
  @Column({ type: 'uuid', nullable: true })
  categoryId: string;

  @ManyToOne(() => Category, (category) => category.item, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @OneToMany(() => ItemStock, (itemStock) => itemStock.item)
  stocks: ItemStock[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.item)
  cartItems: CartItem[];
}
