import { Base } from 'commons/entities';
import { Column, Entity, OneToMany } from 'typeorm';
import { ReturnItem } from './return-item.entity';
import { Exclude } from 'class-transformer';

export type ReturnType = 'order' | 'transaction';

@Entity()
export class Return extends Base {
  @Column()
  name: string;

  @Column()
  type: ReturnType;

  @Exclude()
  @Column('uuid')
  targetId: string;

  @Column()
  invoiceNumber: string;

  @OneToMany(() => ReturnItem, (returnItem) => returnItem.return, {
    onDelete: 'CASCADE',
    eager: true,
  })
  returnItem: ReturnItem[];
}
