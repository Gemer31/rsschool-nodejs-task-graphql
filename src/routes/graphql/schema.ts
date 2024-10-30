import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql/type/index.js';
import { UUIDType } from './types/uuid.js';
import { PrismaClient } from '@prisma/client';
import { IGqlContext, IMemberType, IPost, IProfile, IUser } from './models.js';

const MemberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    BASIC: {value: 'BASIC'},
    BUSINESS: {value: 'BUSINESS'},
  },
});

const User: GraphQLObjectType = new GraphQLObjectType<IUser>({
  name: 'User',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    balance: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    profile: {
      type: Profile,
      resolve: ({id}, args, {prisma}: { prisma: PrismaClient }) => {
        return prisma.profile.findUnique({
          where: {
            userId: id,
          },
        });
      },
    },
    posts: {
      type: new GraphQLList(Post),
      resolve: ({id}, args, {prisma}: { prisma: PrismaClient }) => {
        return prisma.post.findMany({
          where: {
            authorId: id,
          },
        });
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(User),
      resolve: ({id}, args, {prisma}: { prisma: PrismaClient }) => {
        return prisma.user.findMany({
          where: {
            subscribedToUser: {
              some: {
                subscriberId: id,
              },
            },
          },
          include: {
            subscribedToUser: true,
          },
        });
      },
    },
    subscribedToUser: {
      type: new GraphQLList(User),
      resolve: async ({id}, args, {prisma}: { prisma: PrismaClient }) => {
        return prisma.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                authorId: id,
              },
            },
          },
        });
      },
    },
  }),
});

const Post: GraphQLObjectType = new GraphQLObjectType<IPost>({
  name: 'Post',
  fields: () => ({
    id: {type: new GraphQLNonNull(UUIDType)},
    title: {type: new GraphQLNonNull(GraphQLString)},
    content: {type: new GraphQLNonNull(GraphQLString)},
  }),
});

const Profile: GraphQLObjectType = new GraphQLObjectType<IProfile>({
  name: 'Profile',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
    isMale: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    yearOfBirth: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    userId: {
      type: new GraphQLNonNull(UUIDType),
    },
    memberTypeId: {
      type: MemberTypeId,
    },
    memberType: {
      type: MemberType,
      resolve: ({memberTypeId}: { memberTypeId: string }, args, {prisma}: { prisma: PrismaClient }) => {
        return prisma.memberType.findUnique({
          where: {
            id: memberTypeId,
          },
        });
      },
    },
  }),
});

const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: {type: new GraphQLNonNull(GraphQLString)},
    balance: {type: new GraphQLNonNull(GraphQLFloat)},
  },
});

const MemberType = new GraphQLObjectType<IMemberType>({
  name: 'MemberType',
  fields: () => ({
    id: {type: MemberTypeId},
    discount: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    postsLimitPerMonth: {
      type: new GraphQLNonNull(GraphQLInt),
    },
  }),
});

const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: (src, args, {prisma}: { prisma: PrismaClient }) => {
        return prisma.memberType.findMany();
      },
    },
    memberType: {
      type: MemberType,
      args: {id: {type: new GraphQLNonNull(MemberTypeId)}},
      resolve: (src, {id}, {prisma}: { prisma: PrismaClient }) => {
        return prisma.memberType.findUnique({
          where: {
            id: id as string,
          },
        });
      },
    },

    users: {
      type: new GraphQLList(User),
      resolve: (src, args, {prisma}: { prisma: PrismaClient }) => {
        return prisma.user.findMany();
      },
    },
    user: {
      type: User,
      args: {id: {type: new GraphQLNonNull(UUIDType)}},
      resolve: async (src, {id}, ctx: { prisma: PrismaClient }) => {
        return ctx.prisma.user.findUnique({
          where: {id: id as string},
        });
      },
    },

    posts: {
      type: new GraphQLList(Post),
      resolve: async (src, args, {prisma}: IGqlContext) => {
        return prisma.post.findMany();
      },
    },
    post: {
      type: Post,
      args: {id: {type: new GraphQLNonNull(UUIDType)}},
      resolve: async (src, {id}, {prisma}: IGqlContext) => {
        return prisma.post.findUnique({
          where: {id: id as string},
        });
      },
    },

    profiles: {
      type: new GraphQLList(Profile),
      resolve: async (src, args, {prisma}: IGqlContext) => {
        return prisma.profile.findMany();
      },
    },
    profile: {
      type: Profile,
      args: {id: {type: new GraphQLNonNull(UUIDType)}},
      resolve: async (src, {id}, {prisma}: IGqlContext) => {
        return prisma.profile.findUnique({
          where: {id: id as string},
        });
      },
    },
  }),
});

const Mutations = new GraphQLObjectType({
  name: 'Mutations',
  fields: () => ({
    createUser: {
      type: new GraphQLNonNull(User),
      args: {dto: {type: new GraphQLNonNull(CreateUserInput)}},
      resolve: async (
        _,
        {dto}: { dto: { name: string; balance: number } },
        {prisma}: { prisma: PrismaClient },
      ) => {
        return prisma.user.create({data: dto});
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: Mutations,
});

export default schema;
