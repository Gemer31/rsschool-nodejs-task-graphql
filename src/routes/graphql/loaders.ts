import { MemberType, PrismaClient, User } from '@prisma/client';
import DataLoader from 'dataloader';

export const userLoader = (prisma: PrismaClient): DataLoader<string, User | null> => {
  return new DataLoader(async (ids) => {
    const users = await prisma.user.findMany({
      where: {id: {in: ids as string[]}},
      include: {userSubscribedTo: true, subscribedToUser: true},
    });

    const usersMap = new Map(users.map((user) => [user.id, user]));
    return ids.map((key) => usersMap.get(key) || null);
  });
};

export const memberTypeLoader = (prisma: PrismaClient): DataLoader<string, MemberType | null> => {
  return new DataLoader(async (ids) => {
    const memberTypes = await prisma.memberType.findMany({
      where: {id: {in: ids as string[]}},
    });

    const memberTypesMap = new Map(memberTypes.map((memberType) => [memberType.id, memberType]));
    return ids.map((key) => memberTypesMap.get(key) || null);
  });
};
