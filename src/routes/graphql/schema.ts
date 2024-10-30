import {
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql/type/index.js';
import { UUIDType } from './types/uuid.js';
import { PrismaClient } from '@prisma/client';

const User: GraphQLObjectType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {type: new GraphQLNonNull(UUIDType)},
    name: {type: new GraphQLNonNull(GraphQLString)},
    balance: {type: new GraphQLNonNull(GraphQLFloat)},
  }),
});

const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    user: {
      type: User,
      args: {id: {type: new GraphQLNonNull(UUIDType)}},
      resolve: async (_, {id}, ctx: { prisma: PrismaClient }) => {
        return ctx.prisma.user.findUnique({
          where: {id: id as string},
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
