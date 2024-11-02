import { GraphQLInputObjectType, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql/type/index.js';
import { IPost } from '../models.js';
import { UUIDType } from './uuid.js';

export const CreatePostInput = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: {
    authorId: {type: new GraphQLNonNull(UUIDType)},
    title: {type: new GraphQLNonNull(GraphQLString)},
    content: {type: new GraphQLNonNull(GraphQLString)},
  },
});

export const ChangePostInput = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: {
    title: {type: GraphQLString},
    content: {type: GraphQLString},
  },
});

export const PostType: GraphQLObjectType = new GraphQLObjectType<IPost>({
  name: 'Post',
  fields: () => ({
    id: {type: new GraphQLNonNull(UUIDType)},
    title: {type: new GraphQLNonNull(GraphQLString)},
    content: {type: new GraphQLNonNull(GraphQLString)},
  }),
});
