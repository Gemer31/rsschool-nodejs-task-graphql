import { PrismaClient } from '@prisma/client';
import { userLoader } from './userLoader.js';
import { memberTypeLoader } from './memberTypeLoader.js';
import { userPostsLoader } from './userPostsLoader.js';
import { profileLoader } from './profileLoader.js';
import { userSubscribedToLoader } from './userSubscribedToLoader.js';
import { subscribedToUserLoader } from './subscribedToUserLoader.js';
import { IDataLoaders } from '../models/loaders.js';

export function getLoaders(prisma: PrismaClient): IDataLoaders {
  return {
    userLoader: userLoader(prisma),
    memberTypeLoader: memberTypeLoader(prisma),
    userPostsLoader: userPostsLoader(prisma),
    profileLoader: profileLoader(prisma),
    userSubscribedToLoader: userSubscribedToLoader(prisma),
    subscribedToUserLoader: subscribedToUserLoader(prisma)
  };
}
