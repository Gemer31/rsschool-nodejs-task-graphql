import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { IUser } from '../models/user.js';

export function subscribedToUserLoader(prisma: PrismaClient) {
  return new DataLoader(async (userIds: ReadonlyArray<string>) => {
    const subscribersOnAuthors = await prisma.subscribersOnAuthors.findMany({
      where: { authorId: { in: userIds as string[] } },
      include: { subscriber: true },
    });
    const subscribers: Record<string, IUser[]> = {};
    subscribersOnAuthors.forEach((sub) => {
      if (subscribers[sub.authorId]) {
        subscribers[sub.authorId].push(sub.subscriber);
      } else {
        subscribers[sub.authorId] = [sub.subscriber];
      }
    });
    return userIds.map((userId) => subscribers[userId] || []);
  });
}
