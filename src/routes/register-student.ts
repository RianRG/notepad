import {fastifyJwt} from "@fastify/jwt";
import { PrismaService } from "../repositories/prisma/prisma-service";
import { RegisterStudentService } from "../services/register-student";
import { FastifyTypedInstance } from "../types";
import { hash } from "bcrypt";
import { z } from 'zod';
import { RegisteredEmailService } from "../services/registered-email";

export async function RegisterStudentRoute(app: FastifyTypedInstance){
    app.post('/students/register', {
        schema: {
            body: z.object({
                username: z.string(),
                email: z.string().email(),
                password: z.string().min(6)
            }),
            response: {
                201: z.object({
                    id: z.string()
                })
            }
            
        }
    }, async (req, res) =>{
        const { username, email, password } = req.body;

        const hashedPassword = await hash(password, 4);
        const prismaRepository = new PrismaService();
        const registerStudentService = new RegisterStudentService(prismaRepository);
        
        const sessionId = app.jwt.sign({ user: username })
        res.setCookie('sessionId', sessionId, {
            path: '/',
            httpOnly: true,
            signed: true,
            sameSite: 'none',
            secure: true,
            maxAge: 1000 * 3600 * 24 * 7 // 7 days
        })
        const cookie = app.signCookie(sessionId)
        const student = await registerStudentService.execute({ username, email, password: hashedPassword, sessionId: cookie })

        const registeredEmailService = new RegisteredEmailService();

        await registeredEmailService.execute(email, username)

        return res.status(201).send({ id: student.id })
    })
}