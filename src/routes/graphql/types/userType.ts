import {
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql/type/index.js';
import { IGqlContext, IUser } from '../models.js';
import { UUIDType } from './uuid.js';
import { ProfileType } from './profileType.js';
import { PostType } from './postType.js';

export const CreateUserInputType = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: {type: new GraphQLNonNull(GraphQLString)},
    balance: {type: new GraphQLNonNull(GraphQLFloat)},
  },
});

export const ChangeUserInputType = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: {type: GraphQLString},
    balance: {type: GraphQLFloat},
  },
});

export const UserType: GraphQLObjectType = new GraphQLObjectType<IUser>({
  name: 'User',
  fields: () => ({
    id: {type: new GraphQLNonNull(UUIDType)},
    name: {type: new GraphQLNonNull(GraphQLString)},
    balance: {type: new GraphQLNonNull(GraphQLFloat)},
    profile: {
      type: ProfileType,
      resolve: (parent, args, {prisma}: IGqlContext) => {
        return parent.profile || prisma.profile.findUnique({
          where: {
            userId: parent.id,
          },
        });
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: ({id}, args, {prisma}: IGqlContext) => prisma.post.findMany({
        where: {
          authorId: id,
        },
      }),
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async (parent, args, {prisma, userLoader}: IGqlContext) => {
        const res: IUser[] = [];

        if (parent.subscribedToUser) {
          for (const s of parent.subscribedToUser) {
            let user: IUser = await userLoader.load(s.subscriberId);

            if (!user) {
              user = (await prisma.user.findUnique({
                where: {id: s.subscriberId},
                include: {
                  subscribedToUser: true,
                  userSubscribedTo: true,
                },
              })) as IUser;

              userLoader.prime(user.id, user);
            }

            user && res.push(user);
          }
        }

        return res;
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async (parent, args, {prisma, userLoader}: IGqlContext) => {
        const res: IUser[] = [];

        if (parent.userSubscribedTo) {
          for (const s of parent.userSubscribedTo) {
            let user: IUser = await userLoader.load(s.authorId);

            if (!user) {
              user = (await prisma.user.findUnique({
                where: {id: s.authorId},
                include: {
                  subscribedToUser: true,
                  userSubscribedTo: true,
                },
              })) as IUser;

              userLoader.prime(user.id, user);
            }

            user && res.push(user);
          }
        }

        return res;
      },
    },
  }),
});
