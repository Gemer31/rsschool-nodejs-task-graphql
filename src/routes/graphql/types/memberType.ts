import { GraphQLEnumType, GraphQLFloat, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql/type/index.js';
import { IMemberType } from '../models.js';

export const MemberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    BASIC: {value: 'BASIC'},
    BUSINESS: {value: 'BUSINESS'},
  },
});

export const MemberType = new GraphQLObjectType<IMemberType>({
  name: 'MemberType',
  fields: () => ({
    id: {type: MemberTypeId},
    discount: {type: new GraphQLNonNull(GraphQLFloat)},
    postsLimitPerMonth: {type: new GraphQLNonNull(GraphQLInt)},
  }),
});
