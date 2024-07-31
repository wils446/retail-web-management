import { Column, Entity } from 'typeorm';

import { Base } from 'commons/entities';
import { Exclude } from 'class-transformer';

@Entity()
export class User extends Base {
  @Column()
  username: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ default: 'none' })
  role: 'admin' | 'none';
}
