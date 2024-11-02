import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { ISubscribedToUserLoader } from '../models/loaders.js';
import { SubscribersOnAuthorsExtended } from '../models/subscribeOnAuthors.js';

export function userSubscribedToLoader(prisma: PrismaClient): ISubscribedToUserLoader {
  return new DataLoader(async (userIds: ReadonlyArray<string>) => {
    const subscribersOnAuthors = await prisma.subscribersOnAuthors.findMany({
      where: {subscriberId: {in: userIds as string[]}},
      include: {author: true},
    });
    const subscriptions: Record<string, SubscribersOnAuthorsExtended[]> = {};
    subscribersOnAuthors.forEach((sub) => {
      if (subscriptions[sub.subscriberId]) {
        subscriptions[sub.subscriberId].push(sub);
      } else {
        subscriptions[sub.subscriberId] = [sub];
      }
    });
    return userIds.map((userId) => subscriptions[userId] || []);
  });
}
