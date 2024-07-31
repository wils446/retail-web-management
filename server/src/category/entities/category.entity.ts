import { Column, Entity, OneToMany } from 'typeorm';

import { Base } from 'commons/entities';
import { Item } from 'item/entities';

@Entity()
export class Category extends Base {
  @Column()
  name: string;

  @OneToMany(() => Item, (item) => item.category)
  item: Item[];
}
