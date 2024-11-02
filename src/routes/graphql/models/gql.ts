import { PrismaClient } from '@prisma/client';
import { IDataLoaders } from './loaders.js';
import { IId } from './common.js';

export interface IGqlArgs<T = undefined> extends IId {
  dto: T;
  userId: string;
  authorId: string;
}

export interface IGqlContext extends IDataLoaders {
  prisma: PrismaClient;
}
