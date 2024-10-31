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
import {
  IGqlArgs,
  IGqlContext,
  IId,
  IMemberType,
  IPost,
  IPostInput,
  IProfile,
  IProfileInput,
  IUser,
  IUserInput,
  Messages,
} from './models.js';

const MemberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    BASIC: {value: 'BASIC'},
    BUSINESS: {value: 'BUSINESS'},
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

const ChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: {type: GraphQLString},
    balance: {type: GraphQLFloat},
  },
});

const CreatePostInput = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: {
    authorId: {type: new GraphQLNonNull(UUIDType)},
    title: {type: new GraphQLNonNull(GraphQLString)},
    content: {type: new GraphQLNonNull(GraphQLString)},
  },
});

const ChangePostInput = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: {
    title: {type: GraphQLString},
    content: {type: GraphQLString},
  },
});

const CreateProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: {
    userId: {type: new GraphQLNonNull(UUIDType)},
    isMale: {type: new GraphQLNonNull(GraphQLBoolean)},
    yearOfBirth: {type: new GraphQLNonNull(GraphQLInt)},
    memberTypeId: {type: new GraphQLNonNull(MemberTypeId)},
  },
});

const ChangeProfileInput = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: {
    isMale: {type: GraphQLBoolean},
    yearOfBirth: {type: GraphQLInt},
    memberTypeId: {type: MemberTypeId},
  },
});

const RootQueryType = new GraphQLObjectType({
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
      type: new GraphQLList(User),
      resolve: (src, args, {prisma}: IGqlContext) => prisma.user.findMany(),
    },
    user: {
      type: User,
      args: {id: {type: new GraphQLNonNull(UUIDType)}},
      resolve: (src, {id}, {prisma}: IGqlContext) => prisma
        .user
        .findUnique({
          where: {id: id as string},
        }),
    },

    posts: {
      type: new GraphQLList(Post),
      resolve: (src, args, {prisma}: IGqlContext) => prisma.post.findMany(),
    },
    post: {
      type: Post,
      args: {id: {type: new GraphQLNonNull(UUIDType)}},
      resolve: (src, {id}, {prisma}: IGqlContext) => prisma
        .post
        .findUnique({
          where: {id: id as string},
        }),
    },

    profiles: {
      type: new GraphQLList(Profile),
      resolve: (src, args, {prisma}: IGqlContext) => prisma.profile.findMany(),
    },
    profile: {
      type: Profile,
      args: {id: {type: new GraphQLNonNull(UUIDType)}},
      resolve: (src, {id}, {prisma}: IGqlContext) => prisma
        .profile
        .findUnique({
          where: {id: id as string},
        }),
    },
  }),
});

const Mutations = new GraphQLObjectType({
  name: 'Mutations',
  fields: () => ({
    createUser: {
      type: new GraphQLNonNull(User),
      args: {dto: {type: new GraphQLNonNull(CreateUserInput)}},
      resolve: (src, {dto}: IGqlArgs<IUserInput>, {prisma}: IGqlContext) => prisma
        .user
        .create({data: dto}),
    },
    deleteUser: {
      type: GraphQLString,
      args: {id: {type: new GraphQLNonNull(UUIDType)}},
      resolve: async (src, {id}: IId, {prisma}: IGqlContext) => {
        await prisma.user.delete({where: {id}});
        return Messages.DELETED_SUCCESSFULLY;
      },
    },
    changeUser: {
      type: User,
      args: {
        id: {type: new GraphQLNonNull(UUIDType)},
        dto: {type: new GraphQLNonNull(ChangeUserInput)},
      },
      resolve: async (src, {id, dto}: IGqlArgs<Partial<IUserInput>>, {prisma}: IGqlContext) => prisma
        .user
        .update({where: {id}, data: {...dto}}),
    },

    createPost: {
      type: new GraphQLNonNull(Post),
      args: {dto: {type: new GraphQLNonNull(CreatePostInput)}},
      resolve: (src, {dto}: IGqlArgs<IPostInput>, {prisma}: IGqlContext) => prisma
        .post
        .create({data: dto}),
    },
    deletePost: {
      type: GraphQLString,
      args: {id: {type: new GraphQLNonNull(UUIDType)}},
      resolve: async (src, {id}: IId, {prisma}: IGqlContext) => {
        await prisma.post.delete({where: {id}});
        return Messages.DELETED_SUCCESSFULLY;
      },
    },
    changePost: {
      type: Post,
      args: {
        id: {type: new GraphQLNonNull(UUIDType)},
        dto: {type: new GraphQLNonNull(ChangePostInput)},
      },
      resolve: async (src, {id, dto}: IGqlArgs<Partial<IPostInput>>, {prisma}: IGqlContext) => prisma
        .post
        .update({where: {id}, data: {...dto}}),
    },

    createProfile: {
      type: new GraphQLNonNull(Profile),
      args: {dto: {type: new GraphQLNonNull(CreateProfileInput)}},
      resolve: (src, {dto}: IGqlArgs<IProfileInput>, {prisma}: IGqlContext) => prisma
        .profile
        .create({data: dto}),
    },
    deleteProfile: {
      type: GraphQLString,
      args: {id: {type: new GraphQLNonNull(UUIDType)}},
      resolve: async (src, {id}: IId, {prisma}: IGqlContext) => {
        await prisma.profile.delete({where: {id}});
        return Messages.DELETED_SUCCESSFULLY;
      },
    },
    changeProfile: {
      type: Profile,
      args: {
        id: {type: new GraphQLNonNull(UUIDType)},
        dto: {type: new GraphQLNonNull(ChangeProfileInput)},
      },
      resolve: (src, {id, dto}: IGqlArgs<Partial<IProfileInput>>, {prisma}: IGqlContext) => prisma
        .profile
        .update({where: {id}, data: {...dto}}),
    },

    subscribeTo: {
      type: GraphQLString,
      args: {
        userId: {type: new GraphQLNonNull(UUIDType)},
        authorId: {type: new GraphQLNonNull(UUIDType)},
      },
      resolve: async (src, {userId, authorId}: IGqlArgs, {prisma}: IGqlContext) => {
        await prisma.user.update({
          where: {id: userId},
          data: {userSubscribedTo: {create: {authorId}}},
        });
        return authorId;
      },
    },
    unsubscribeFrom: {
      type: GraphQLString,
      args: {
        userId: {type: new GraphQLNonNull(UUIDType)},
        authorId: {type: new GraphQLNonNull(UUIDType)},
      },
      resolve: async (src, {userId, authorId}: IGqlArgs, {prisma}: IGqlContext) => {
        await prisma.user.update({
          where: {id: userId},
          data: {userSubscribedTo: {deleteMany: {authorId}}},
        });
        return authorId;
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: Mutations,
});

export default schema;
