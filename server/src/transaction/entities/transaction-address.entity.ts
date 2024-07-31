import { Column, Entity, OneToOne } from 'typeorm';

import { Base } from 'commons/entities';
import { Transaction } from './transaction.entity';

@Entity()
export class TransactionAddress extends Base {
  @Column({ default: null, nullable: true })
  address: string;

  @Column({ default: null, nullable: true })
  city: string;

  @Column({ default: null, nullable: true })
  province: string;

  @Column({ default: null, nullable: true })
  postalCode: string;

  @Column({ default: null, nullable: true })
  country: string;

  @OneToOne(() => Transaction, (transaction) => transaction.address, {
    onDelete: 'CASCADE',
  })
  transaction: Transaction;
}
