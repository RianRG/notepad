import { fastify } from 'fastify'
import cookie from '@fastify/cookie'
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';

const app = fastify();
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(cookie, {
    secret: process.env.COOKIE_SECRET,
    hook: 'onRequest'
})

export { app };