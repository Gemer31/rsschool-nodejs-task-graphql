import { PrismaClient } from '@prisma/client';

export interface IGqlContext {
  prisma: PrismaClient;
}

export interface IUser {
  id: string;
  name: string;
  balance: number;
  profile: IProfile;
  posts: IPost[];
  userSubscribedTo: IUser[];
  subscribedToUser: IUser[];
}

export interface IProfile {
  id: string;
  isMale: boolean;
  yearOfBirth: number;
  userId: string;
  memberTypeId: string;
  memberType: IMemberType;
}

export interface IPost {
  id: string;
  title: string;
  content: string;
}

export interface IMemberType {
  id: string;
  discount: number;
  postsLimitPerMonth: number;
}
