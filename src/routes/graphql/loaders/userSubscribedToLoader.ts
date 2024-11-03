import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { ISubscribedToUserLoader } from '../models/loaders.js';
import { IUser } from '../models/user.js';

export function userSubscribedToLoader(prisma: PrismaClient): ISubscribedToUserLoader {
  return new DataLoader(async (userIds: ReadonlyArray<string>) => {
    const subscribersOnAuthors = await prisma.subscribersOnAuthors.findMany({
      where: {subscriberId: {in: userIds as string[]}},
      include: {author: true},
    });
    const subscriptions: Record<string, IUser[]> = {};
    subscribersOnAuthors.forEach((sub) => {
      if (subscriptions[sub.subscriberId]) {
        subscriptions[sub.subscriberId].push(sub.author);
      } else {
        subscriptions[sub.subscriberId] = [sub.author];
      }
    });
    return userIds.map((userId) => subscriptions[userId] || []);
  });
}
