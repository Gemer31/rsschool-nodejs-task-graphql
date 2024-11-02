import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql/type/index.js';
import { IGqlArgs, IGqlContext, IId, IPostInput, IProfileInput, IUserInput, Messages } from '../models.js';
import { UUIDType } from './uuid.js';
import { ChangeUserInputType, CreateUserInputType, UserType } from './userType.js';
import { ChangePostInput, CreatePostInput, PostType } from './postType.js';
import { ChangeProfileInputType, CreateProfileInputType, ProfileType } from './profileType.js';

export const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createUser: {
      type: new GraphQLNonNull(UserType),
      args: {dto: {type: new GraphQLNonNull(CreateUserInputType)}},
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
      type: UserType,
      args: {
        id: {type: new GraphQLNonNull(UUIDType)},
        dto: {type: new GraphQLNonNull(ChangeUserInputType)},
      },
      resolve: async (src, {id, dto}: IGqlArgs<Partial<IUserInput>>, {prisma}: IGqlContext) => prisma
        .user
        .update({where: {id}, data: {...dto}}),
    },

    createPost: {
      type: new GraphQLNonNull(PostType),
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
      type: PostType,
      args: {
        id: {type: new GraphQLNonNull(UUIDType)},
        dto: {type: new GraphQLNonNull(ChangePostInput)},
      },
      resolve: async (src, {id, dto}: IGqlArgs<Partial<IPostInput>>, {prisma}: IGqlContext) => prisma
        .post
        .update({where: {id}, data: {...dto}}),
    },

    createProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: {dto: {type: new GraphQLNonNull(CreateProfileInputType)}},
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
      type: ProfileType,
      args: {
        id: {type: new GraphQLNonNull(UUIDType)},
        dto: {type: new GraphQLNonNull(ChangeProfileInputType)},
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
