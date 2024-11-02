import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { IMemberTypeDataLoader } from '../models/loaders.js';

export function memberTypeLoader(prisma: PrismaClient): IMemberTypeDataLoader {
  return new DataLoader(async (ids: ReadonlyArray<string>) => {
    const memberTypes = await prisma.memberType.findMany({
      where: {id: {in: ids as string[]}},
    });
    const memberTypeMap = new Map(memberTypes.map((memberType) => [memberType.id, memberType]));
    return ids.map((id) => memberTypeMap.get(id) || null);
  });
}
