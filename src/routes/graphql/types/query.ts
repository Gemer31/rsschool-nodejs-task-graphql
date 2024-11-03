import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql/type/index.js';
import { parseResolveInfo, ResolveTree, simplifyParsedResolveInfoFragmentWithType } from 'graphql-parse-resolve-info';
import { UUIDType } from './uuid.js';
import { UserType } from './user.js';
import { MemberType, MemberTypeId } from './memberType.js';
import { PostType } from './postType.js';
import { ProfileType } from './profileType.js';
import { IGqlContext } from '../models/gql.js';
import { IUserExtended } from '../models/user.js';
import { IId } from '../models/common.js';
import { IProfileExtended } from '../models/profile.js';

export const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: (src, args, {prisma}: IGqlContext) => prisma.memberType.findMany(),
    },
    memberType: {
      type: MemberType,
      args: {id: {type: new GraphQLNonNull(MemberTypeId)}},
      resolve: (src, {id}, {prisma}: IGqlContext) => prisma
        .memberType
        .findUnique({
          where: {
            id: id as string,
          },
        }),
    },

    users: {
      type: new GraphQLList(UserType),
      resolve: async (parent, args, {prisma, userLoader}: IGqlContext, info) => {
        const parsedInfo = parseResolveInfo(info) as ResolveTree;
        const {fields} = simplifyParsedResolveInfoFragmentWithType(parsedInfo, UserType);

        const users = await prisma.user.findMany({
          include: {
            userSubscribedTo: 'userSubscribedTo' in fields,
            subscribedToUser: 'subscribedToUser' in fields,
            // posts: 'posts' in fields,
            profile: 'profile' in fields,
          },
        }) as IUserExtended[];
        users.forEach((user) => userLoader.prime(user.id, user));
        return users;
      },
    },
    user: {
      type: UserType,
      args: {id: {type: new GraphQLNonNull(UUIDType)}},
      resolve: async (src, {id}: IId, {prisma, userLoader}: IGqlContext, info) => {
        const parsedInfo = parseResolveInfo(info) as ResolveTree;
        const {fields} = simplifyParsedResolveInfoFragmentWithType(parsedInfo, UserType);

        const user = await prisma.user.findUnique({
          where: {id},
          include: {
            userSubscribedTo: 'userSubscribedTo' in fields,
            subscribedToUser: 'subscribedToUser' in fields,
            posts: 'posts' in fields,
            profile: 'profile' in fields,
          },
        }) as IUserExtended;
        user?.id && userLoader.prime(user.id, user);
        return user;
      },
    },

    posts: {
      type: new GraphQLList(PostType),
      resolve: (src, args, {prisma}: IGqlContext) => prisma.post.findMany(),
    },
    post: {
      type: PostType,
      args: {id: {type: new GraphQLNonNull(UUIDType)}},
      resolve: (src, {id}, {prisma}: IGqlContext) => prisma
        .post
        .findUnique({
          where: {id: id as string},
        }),
    },

    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: async (src, args, {prisma, profileLoader}: IGqlContext) => {
        const profiles = await prisma.profile.findMany();
        profiles.forEach((profile) => {
          profileLoader.prime(profile.id, profile as IProfileExtended);
        });
        return profiles;
      },
    },
    profile: {
      type: ProfileType,
      args: {id: {type: new GraphQLNonNull(UUIDType)}},
      resolve: (src, {id}, {prisma}: IGqlContext) => prisma
        .profile
        .findUnique({
          where: {id: id as string},
        }),
    },
  }),
});
