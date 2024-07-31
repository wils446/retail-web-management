import { User } from 'user/entities';

export class GetUsersQuery {
  constructor(public readonly authUser: User) {}
}
