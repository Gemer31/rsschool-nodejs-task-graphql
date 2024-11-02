import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';

export enum Messages {
  DELETED_SUCCESSFULLY = 'Deleted successfully'
}

export interface IGqlArgs<T = undefined> extends IId {
  dto: T;
  userId: string;
  authorId: string;
}

export interface IGqlContext {
  prisma: PrismaClient;
  userLoader: DataLoader<string, IUser>;
  memberTypeLoader: DataLoader<string, IMemberType>;
  profileLoader: DataLoader<string, IProfile>;
  userPostsLoader: DataLoader<string, IPost[]>;

  userSubscribedToLoader: DataLoader<string, IUser[]>;
  subscribedToUserLoader: DataLoader<string, IUser[]>;
}

export interface IId {
  id: string;
}

export interface IUser extends IUserInput, IId {
  profile: IProfile;
  posts: IPost[];
  userSubscribedTo: SubscribersOnAuthors[];
  subscribedToUser: SubscribersOnAuthors[];
}

export interface SubscribersOnAuthors {
  subscriberId: string;
  authorId: string;
}

export interface IUserInput {
  name: string;
  balance: number;
}

export interface IProfile extends IProfileInput, IId {
  memberType: IMemberType;
}

export interface IProfileInput {
  userId: string;
  isMale: boolean;
  yearOfBirth: number;
  memberTypeId: string;
}

export interface IPost extends IPostInput, IId {
  author: IUser;
}

export interface IPostInput {
  title: string;
  content: string;
  authorId: string;
}

export interface IMemberType extends IId {
  discount: number;
  postsLimitPerMonth: number;
}
