import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { SubscribersOnAuthorsExtended } from '../models/subscribeOnAuthors.js';

export function subscribedToUserLoader(prisma: PrismaClient) {
  return new DataLoader(async (userIds: ReadonlyArray<string>) => {
    const subscribersOnAuthors = await prisma.subscribersOnAuthors.findMany({
      where: { authorId: { in: userIds as string[] } },
      include: { subscriber: true },
    });
    const subscribers: Record<string, SubscribersOnAuthorsExtended[]> = {};
    subscribersOnAuthors.forEach((sub) => {
      if (subscribers[sub.authorId]) {
        subscribers[sub.authorId].push(sub);
      } else {
        subscribers[sub.authorId] = [sub];
      }
    });
    return userIds.map((userId) => subscribers[userId] || []);
  });
}
