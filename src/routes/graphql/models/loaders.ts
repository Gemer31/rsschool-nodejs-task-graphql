import DataLoader from 'dataloader';
import { IUser } from './user.js';
import { IMemberType } from './memberType.js';
import { IProfile } from './profile.js';
import { IPost } from './post.js';

export interface IDataLoaders {
  userLoader: IUserDataLoader;
  memberTypeLoader: IMemberTypeDataLoader;
  profileLoader: IProfileDataLoader;
  userPostsLoader: IUserPostsDataLoader;
  userSubscribedToLoader: IUserSubscribedToLoader;
  subscribedToUserLoader: ISubscribedToUserLoader;
}

export type IUserDataLoader = DataLoader<string, IUser | null>;
export type IMemberTypeDataLoader = DataLoader<string, IMemberType | null>;
export type IProfileDataLoader = DataLoader<string, IProfile | null>;
export type IUserPostsDataLoader = DataLoader<string, IPost[]>;
export type IUserSubscribedToLoader = DataLoader<string, IUser[], string>;
export type ISubscribedToUserLoader = IUserSubscribedToLoader;
