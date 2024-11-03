import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql/type/index.js';
import { UUIDType } from './uuid.js';
import { MemberType, MemberTypeId } from './memberType.js';
import { IGqlContext } from '../models/gql.js';
import { IMemberType } from '../models/memberType.js';

export const CreateProfileInputType = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: {
    userId: {type: new GraphQLNonNull(UUIDType)},
    isMale: {type: new GraphQLNonNull(GraphQLBoolean)},
    yearOfBirth: {type: new GraphQLNonNull(GraphQLInt)},
    memberTypeId: {type: new GraphQLNonNull(MemberTypeId)},
  },
});

export const ChangeProfileInputType = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: {
    isMale: {type: GraphQLBoolean},
    yearOfBirth: {type: GraphQLInt},
    memberTypeId: {type: MemberTypeId},
  },
});

export const ProfileType: GraphQLObjectType = new GraphQLObjectType({
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
      resolve: async (
        {memberTypeId}: { memberTypeId: string },
        args,
        {prisma, memberTypeLoader}: IGqlContext,
      ) => {
        let memberType: IMemberType | null = await memberTypeLoader.load(memberTypeId);

        if (!memberType) {
          memberType = await prisma.memberType.findUnique({
            where: {id: memberTypeId},
          });
          memberTypeLoader.prime(memberTypeId, memberType as IMemberType);
        }

        return memberType;
      },
    },
  }),
});
