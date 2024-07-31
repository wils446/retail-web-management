import { Base } from 'commons/entities';
import { Column, Entity } from 'typeorm';

export type HistoryType = 'create' | 'update' | 'delete';

@Entity()
export class History extends Base {
  @Column()
  text: string;

  @Column()
  type: HistoryType;

  @Column({ nullable: true })
  detail: string;
}
