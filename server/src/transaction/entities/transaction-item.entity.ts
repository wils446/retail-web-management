import { Exclude } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { Base } from 'commons/entities';
import { Item } from 'item/entities';
import { Transaction } from './transaction.entity';
import { TransactionItemStock } from './transaction-item-stock.entity';

@Entity()
export class TransactionItem extends Base {
  @Column()
  name: string;

  @Column()
  quantity: number;

  @Column()
  price: number;

  @Exclude()
  @Column({ type: 'uuid' })
  itemId: string;

  @Exclude()
  @Column({ type: 'uuid' })
  transactionId: string;

  @ManyToOne(() => Item, { onDelete: 'SET NULL', nullable: true, eager: true })
  @JoinColumn({ name: 'itemId' })
  item: Item;

  @ManyToOne(() => Transaction, (transaction) => transaction.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'transactionId' })
  transaction: Transaction;

  @OneToMany(
    () => TransactionItemStock,
    (transactionItemStock) => transactionItemStock.transactionItem,
    { eager: true, onDelete: 'CASCADE' },
  )
  stocks: TransactionItemStock[];
}
