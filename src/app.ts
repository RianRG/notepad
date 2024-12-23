import { fastify } from 'fastify'
import cookie from '@fastify/cookie'
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';
import { RegisterStudentRoute } from './routes/register-student';
import { RegisterNoteRoute } from './routes/register-notes';
import { DeleteNoteRoute } from './routes/delete-note';
import { GetNotesRoute } from './routes/get-notes';

const app = fastify().withTypeProvider<ZodTypeProvider>();
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(cookie, {
    secret: process.env.COOKIE_SECRET,
    hook: 'onRequest'
})

app.register(RegisterStudentRoute)
app.register(RegisterNoteRoute)
app.register(DeleteNoteRoute)
// app.register(GetNotesRoute)

export { app };