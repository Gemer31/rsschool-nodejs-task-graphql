import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { IProfileDataLoader } from '../models/loaders.js';

export function profileLoader(prisma: PrismaClient): IProfileDataLoader {
  return new DataLoader(async (userIds: ReadonlyArray<string>) => {
    const profiles = await prisma.profile.findMany({
      where: { userId: { in: userIds as string[] } },
    });
    const profileMap = new Map(profiles.map((profile) => [profile.userId, profile]));
    return userIds.map((userId) => profileMap.get(userId) || null);
  });
}
