import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { IId, IPostInput } from './models.js';

export function getLoaders(prisma: PrismaClient) {
  return {
    userLoader: new DataLoader(async (ids: ReadonlyArray<string>) => {
      const users = await prisma.user.findMany({
        where: { id: { in: ids as string[]} },
      });
      const userMap = new Map(users.map((user) => [user.id, user]));
      return ids.map((id) => userMap.get(id));
    }),
    memberTypeLoader: new DataLoader(async (ids: ReadonlyArray<string>) => {
      const memberTypes = await prisma.memberType.findMany({
        where: { id: { in: ids as string[] } },
      });
      const memberTypeMap = new Map(memberTypes.map((memberType) => [memberType.id, memberType]));
      return ids.map((id) => memberTypeMap.get(id) || null);
    }),
    userPostsLoader: new DataLoader(async (userIds: ReadonlyArray<string>) => {
      const posts: (IPostInput & IId)[] = await prisma.post.findMany({
        where: { authorId: { in: userIds as string[] } },
      });
      const userPosts: Record<string, unknown[]> = {};
      posts.forEach((post) => {
        if (userPosts[post.authorId]) {
          userPosts[post.authorId].push(post);
        } else {
          userPosts[post.authorId] = [post];
        }
      });
      return userIds.map((authorId) => userPosts[authorId] || []);
    }),
    profileLoader: new DataLoader(async (userIds: ReadonlyArray<string>) => {
      const profiles = await prisma.profile.findMany({
        where: { userId: { in: userIds as string[] } },
      });
      const profileMap = new Map(profiles.map((profile) => [profile.userId, profile]));
      return userIds.map((userId) => profileMap.get(userId));
    }),
    userSubscribedToLoader: new DataLoader(async (userIds: ReadonlyArray<string>) => {
      const subscriptions = await prisma.subscribersOnAuthors.findMany({
        where: { subscriberId: { in: userIds as string[] } },
        include: { author: true },
      });
      const subscriptionsMap = new Map();
      subscriptions.forEach((sub) => {
        if (!subscriptionsMap.has(sub.subscriberId)) {
          subscriptionsMap.set(sub.subscriberId, []);
        }
        subscriptionsMap.get(sub.subscriberId).push(sub.author);
      });
      return userIds.map((userId) => subscriptionsMap.get(userId) || []);
    }),
    subscribedToUserLoader: new DataLoader(async (userIds: ReadonlyArray<string>) => {
      const subscribers = await prisma.subscribersOnAuthors.findMany({
        where: { authorId: { in: userIds as string[] } },
        include: { subscriber: true },
      });
      const subscribersMap = new Map();
      subscribers.forEach((sub) => {
        if (!subscribersMap.has(sub.authorId)) {
          subscribersMap.set(sub.authorId, []);
        }
        subscribersMap.get(sub.authorId).push(sub.subscriber);
      });
      return userIds.map((userId) => subscribersMap.get(userId) || []);
    }),
  };
}
