import { fastify } from 'fastify'
import cookies from '@fastify/cookie'
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
const app = fastify();

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

export { app };