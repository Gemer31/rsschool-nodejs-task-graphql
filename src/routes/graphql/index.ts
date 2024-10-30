import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import schema from './schema.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

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
      const variableValues: Record<string, undefined> | undefined= req.body.variables;

      try {
        const errs = validate(
          schema,
          parse(source),
          [depthLimit(5)],
        );

        if (errs.length > 0) {
          return { errors: errs, prisma };
        }

        const result = await graphql({
          schema,
          source,
          variableValues,
          contextValue: { prisma },
        });

        return result.errors
          ? { errors: result.errors, prisma }
          : result;
      } catch (error) {
        return { errors: [{ message: (error as Error).message }], prisma };
      }
    },
  });
};

export default plugin;
