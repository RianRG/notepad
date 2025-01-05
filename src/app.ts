import { fastify } from 'fastify'
import cookie from '@fastify/cookie'
import jwt from '@fastify/jwt'
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';
import { RegisterStudentRoute } from './routes/register-student';
import { RegisterNoteRoute } from './routes/register-notes';
import { DeleteNoteRoute } from './routes/delete-note';
import { GetNotesRoute } from './routes/get-notes';
import { AddFriendRoute } from './routes/add-friend';
import { BlockFriendRoute } from './routes/block-friend';
import { GetFriendNotesRoute } from './routes/get-friend-notes';
import { LoginStudentRoute } from './routes/login-student';
import { GetFriendsRoute } from './routes/get-friends';

const app = fastify().withTypeProvider<ZodTypeProvider>();
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(cookie, {
    secret: process.env.COOKIE_SECRET,
    hook: 'onRequest'
})

app.register(jwt, {
    secret: process.env.COOKIE_SECRET!
})

app.addHook('preHandler', (req, res, done) =>{
    req.jwt = app.jwt;
    return done();
})

app.register(RegisterStudentRoute)
app.register(RegisterNoteRoute)
app.register(DeleteNoteRoute)
app.register(GetNotesRoute)
app.register(AddFriendRoute)
app.register(BlockFriendRoute)
app.register(GetFriendNotesRoute)
app.register(LoginStudentRoute)
app.register(GetFriendsRoute)

export { app };