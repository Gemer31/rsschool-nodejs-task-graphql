import { IId } from './common.js';
import { SubscribersOnAuthors } from './subscribeOnAuthors.js';
import { IProfileExtended } from './profile.js';
import { IPostExtended } from './post.js';

export interface IUserExtended extends IUserInput, IId {
  profile: IProfileExtended;
  posts: IPostExtended[];
  userSubscribedTo: SubscribersOnAuthors[];
  subscribedToUser: SubscribersOnAuthors[];
}

export interface IUserInput {
  name: string;
  balance: number;
}

export type IUser = IUserInput & IId;
