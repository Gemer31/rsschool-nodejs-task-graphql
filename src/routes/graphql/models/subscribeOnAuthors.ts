import { IUser } from './user.js';

export interface SubscribersOnAuthors {
  subscriberId: string;
  authorId: string;
}

export interface SubscribersOnAuthorsExtended extends SubscribersOnAuthors {
  subscriber?: IUser;
  author?: IUser;
}

