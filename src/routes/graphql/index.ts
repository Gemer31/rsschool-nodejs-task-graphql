import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, schema } from './schemas.js';
import { graphql, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { memberTypeLoader, userLoader } from './loaders.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const {prisma} = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const source: string = req.body.query;
      const variableValues = req.body.variables;

      try {
        const errs = validate(
          schema,
          parse(source),
          [depthLimit(5)],
        );

        if (errs.length > 0) {
          return {errors: errs, prisma};
        }

        return await graphql({
          schema,
          source,
          variableValues,
          contextValue: {
            prisma,
            userLoader: userLoader(prisma),
            memberTypeLoader: memberTypeLoader(prisma),
          },
        });
      } catch (error) {
        return {errors: [{message: (error as Error).message}], prisma};
      }
    },
  });
};

export default plugin;
