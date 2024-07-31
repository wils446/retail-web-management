import { Exclude } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { Base } from 'commons/entities';
import { TransactionItem } from './transaction-item.entity';
import { Order } from 'order/entities';

@Entity()
export class TransactionItemStock extends Base {
  @Column()
  stock: number;

  @Column()
  cost: number;

  @Exclude()
  @Column({ type: 'uuid' })
  transactionItemId: string;

  @Exclude()
  @Column({ type: 'uuid' })
  orderId: string;

  @ManyToOne(
    () => TransactionItem,
    (transactionItem) => transactionItem.stocks,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'transactionItemId' })
  transactionItem: TransactionItem;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'orderId' })
  order: Order;
}
