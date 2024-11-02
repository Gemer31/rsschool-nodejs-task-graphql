import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { IPost } from '../models/post.js';
import { IUserPostsDataLoader } from '../models/loaders.js';

export function userPostsLoader(prisma: PrismaClient): IUserPostsDataLoader {
  return new DataLoader(async (userIds: ReadonlyArray<string>) => {
    const posts: IPost[] = await prisma.post.findMany({
      where: {authorId: {in: userIds as string[]}},
    });
    const userPosts: Record<string, IPost[]> = {};
    posts.forEach((post) => {
      if (userPosts[post.authorId]) {
        userPosts[post.authorId].push(post);
      } else {
        userPosts[post.authorId] = [post];
      }
    });
    return userIds.map((authorId) => userPosts[authorId] || []);
  });
}
