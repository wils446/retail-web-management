import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from 'user/entities';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User;
  }

  beforeInsert(event: InsertEvent<User>): void {
    const { password } = event.entity;
    const hashedPassword = this.hashPassword(password);
    event.entity.password = hashedPassword;
  }

  beforeUpdate(event: UpdateEvent<User>): void {
    if (event.entity.password === event.databaseEntity.password) return;

    const hashedPassword = this.hashPassword(event.entity.password);
    event.entity.password = hashedPassword;
  }

  private hashPassword(password: string): string {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(password, salt);

    return hash;
  }
}
