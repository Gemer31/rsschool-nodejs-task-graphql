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
      resolve: ({id, profile}, args, {profileLoader}: IGqlContext) => (profile || profileLoader.load(id)),
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: ({id, posts}, args, {userPostsLoader}: IGqlContext) => (posts || userPostsLoader.load(id)),
    },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (parent, args, {userLoader, userSubscribedToLoader}: IGqlContext) => {
        if (parent.userSubscribedTo) {
          const authorIds = parent.userSubscribedTo.map((sub) => sub.authorId);
          return userLoader.loadMany(authorIds);
        }
        return userSubscribedToLoader.load(parent.id);
      },
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (parent, args, {userLoader, subscribedToUserLoader}: IGqlContext) => {
        if (parent.subscribedToUser) {
          const subscriberIds = parent.subscribedToUser.map((sub) => sub.subscriberId);
          return userLoader.loadMany(subscriberIds);
        }
        return subscribedToUserLoader.load(parent.id);
      },
    },
  }),
});
