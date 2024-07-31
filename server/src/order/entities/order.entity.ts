import { Exclude, Transform } from 'class-transformer';
import { STATUS_MAPPING } from 'commons/constants';
import { Base } from 'commons/entities';
import { Return } from 'return/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { User } from 'user/entities';
import { OrderItem } from './order-item.entity';

@Entity()
export class Order extends Base {
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

  @Exclude()
  @Column({ type: 'uuid' })
  createdById: string;

  @Exclude()
  @Column({ type: 'uuid', nullable: true })
  returnId: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { eager: true })
  items: OrderItem[];

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @OneToOne(() => Return, (retur) => retur.targetId, { nullable: true })
  @JoinColumn({ name: 'returnId' })
  return: Return;
}
