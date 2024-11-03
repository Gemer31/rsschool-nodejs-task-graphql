import DataLoader from 'dataloader';
import { PrismaClient } from '@prisma/client';
import { IUserDataLoader } from '../models/loaders.js';

export function userLoader(prisma: PrismaClient): IUserDataLoader {
  return new DataLoader(async (ids: ReadonlyArray<string>) => {
    const users = await prisma.user.findMany({
      where: {id: {in: ids as string[]}},
    });
    const userMap = new Map(users.map((user) => [user.id, user]));
    return ids.map((id) => userMap.get(id) || null);
  });
}
