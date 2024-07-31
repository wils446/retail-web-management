import { Base } from 'commons/entities';
import { Order } from 'order/entities';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Item } from './item.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class ItemStock extends Base {
  @Column()
  stock: number;

  @Column()
  cost: number;

  @Exclude()
  @Column({ type: 'uuid' })
  orderId: string;

  @Exclude()
  @Column({ type: 'uuid' })
  itemId: string;

  @ManyToOne(() => Item, (item) => item.stocks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'itemId' })
  item: Item;

  @ManyToOne(() => Order, { onDelete: 'CASCADE', eager: true, nullable: true })
  @JoinColumn({ name: 'orderId' })
  order: Order;
}
