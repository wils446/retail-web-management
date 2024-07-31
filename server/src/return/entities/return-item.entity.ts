import { Base } from 'commons/entities';
import { Item } from 'item/entities';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Return } from './return.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class ReturnItem extends Base {
  @Column()
  name: string;

  @Column()
  quantity: number;

  @Column()
  returnPrice: number;

  @Exclude()
  @Column({ type: 'uuid' })
  itemId: string;

  @Exclude()
  @Column({ type: 'uuid' })
  returnId: string;

  @ManyToOne(() => Item, { eager: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'itemId' })
  item: Item;

  @ManyToOne(() => Return, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'returnId' })
  return: Return;
}
