import { FastifyCookie } from "@fastify/cookie";
import { JWT } from "@fastify/jwt";
import { FastifyBaseLogger, FastifyBodyParser, FastifyInstance, FastifySchema, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export type FastifyTypedInstance = FastifyInstance<
    RawServerDefault,
    RawRequestDefaultExpression,
    RawReplyDefaultExpression,
    FastifyBaseLogger,
    ZodTypeProvider
>

declare module 'fastify' {
    interface FastifyRequest{
        jwt: JWT,
        auth: {
          sessionId: string
        }
    }

    interface FastifySchemaWithCookies extends FastifySchema{
      cookies: z.ZodObject<{
        sessionId: z.ZodString
      }>
    }
}