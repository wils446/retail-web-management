import { Item } from 'item/entities';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import { Base } from 'commons/entities';
import { Exclude } from 'class-transformer';

@Entity()
export class OrderItem extends Base {
  @Column()
  name: string;

  @Column()
  quantity: number;

  @Column()
  cost: number;

  @Exclude()
  @Column({ type: 'uuid' })
  itemId: string;

  @Exclude()
  @Column({ type: 'uuid' })
  orderId: string;

  @ManyToOne(() => Item, { eager: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'itemId' })
  item: Item;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;
}
