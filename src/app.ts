import { fastify } from 'fastify'
import cookie from '@fastify/cookie'
import jwt from '@fastify/jwt'
import cors from '@fastify/cors'
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';
import { RegisterStudentRoute } from './routes/register-student';
import { RegisterNoteRoute } from './routes/register-notes';
import { DeleteNoteRoute } from './routes/delete-note';
import { GetNotesRoute } from './routes/get-notes';
import { AddFriendRoute } from './routes/add-friend';
import { GetFriendNotesRoute } from './routes/get-friend-notes';
import { LoginStudentRoute } from './routes/login-student';
import { GetFriendsRoute } from './routes/get-friends';
import { UnfriendRoute } from './routes/unfriend-student';
import { BlockFriendRoute } from './routes/block-friend';
import { GetSessionRoute } from './routes/get-session';

const app = fastify().withTypeProvider<ZodTypeProvider>();
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(cookie, {
    secret: process.env.COOKIE_SECRET,
    hook: 'onRequest',
})

app.register(jwt, {
    secret: process.env.COOKIE_SECRET!
})

app.addHook('preHandler', (req, res, done) =>{
    req.jwt = app.jwt;
    return done();
})

app.register(cors, {
  origin: 'http://localhost:4200',
  credentials: true,
})

app.register(RegisterStudentRoute)
app.register(RegisterNoteRoute)
app.register(DeleteNoteRoute)
app.register(GetNotesRoute)
app.register(AddFriendRoute)
app.register(UnfriendRoute)
app.register(GetFriendNotesRoute)
app.register(LoginStudentRoute)
app.register(GetFriendsRoute)
app.register(BlockFriendRoute)
app.register(GetSessionRoute)

export { app };