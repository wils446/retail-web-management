import { Exclude, Transform } from 'class-transformer';
import { Base } from 'commons/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

import { STATUS_MAPPING } from 'commons/constants';
import { Return } from 'return/entities';
import { User } from 'user/entities';
import { TransactionAddress } from './transaction-address.entity';
import { TransactionItem } from './transaction-item.entity';

@Entity()
export class Transaction extends Base {
  @Column()
  invoiceNumber: string;

  @Column()
  name: string;

  @Column()
  paid: boolean;

  /**
   * 0 = process
   * 1 = delivery
   * 2 = completed
   */
  @Transform(({ value }) => STATUS_MAPPING[value])
  @Column({ default: 0 })
  status: number;

  @Column()
  createdBy: string;

  @Column({ default: 0 })
  discount: number;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  checkoutUser: User;

  @Column()
  totalPrice: number;

  @Exclude()
  @Column({ type: 'uuid' })
  addressId: string;

  @Exclude()
  @Column({ type: 'uuid', nullable: true })
  returnId: string;

  @OneToMany(
    () => TransactionItem,
    (transactionItem) => transactionItem.transaction,
    { onDelete: 'CASCADE', eager: true },
  )
  items: TransactionItem[];

  @OneToOne(
    () => TransactionAddress,
    (transactionAddress) => transactionAddress.transaction,
    { cascade: ['insert'] },
  )
  @JoinColumn({ name: 'addressId' })
  address: TransactionAddress;

  @OneToOne(() => Return, (retur) => retur.targetId, { nullable: true })
  @JoinColumn({ name: 'returnId' })
  return: Return;
}
